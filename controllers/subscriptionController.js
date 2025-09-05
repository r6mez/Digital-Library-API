const Subscription = require('../models/subscriptionModel');
const activeSubscriptionsModel = require('../models/activeSubscribtionModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const { sendSubscriptionActivationEmail } = require('../utils/emailService');
const mongoose = require('mongoose');
const {
  SUCCESS,
  CREATED,
  NO_CONTENT,
  BAD_REQUEST,
  NOT_FOUND
} = require('../constants/httpStatusCodes');

 
const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user });
  res.status(SUCCESS).json({
    success: true,
    data: subscriptions
  });
});

const createSubscription = asyncHandler(async (req, res, next) => {
  const { name, maximum_borrow, price, duration_in_days } = req.body;
  const subscription = await Subscription.create({
    name,
    maximum_borrow,
    price,
    duration_in_days
  });
  res.status(CREATED).json({
    success: true,
    data: subscription
  });
});

const updateSubscription = asyncHandler(async (req, res, next) => {
  const { name, maximum_borrow, price, duration_in_days } = req.body;
  const subscription = await Subscription.findByIdAndUpdate(req.params.id, {
    name,
    maximum_borrow,
    price,
    duration_in_days
  }, { new: true });
  if (!subscription) {
    res.status(NOT_FOUND).json({
      success: false,
      message: 'Subscription not found'
    });
  }
  res.status(SUCCESS).json({
    success: true,
    data: subscription
  });
});

const deleteSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findByIdAndDelete(req.params.id);
  if (!subscription) {
    res.status(NOT_FOUND).json({
      message: 'Subscription not found'
    });
  }
  res.status(SUCCESS).json({
    message: "Subscription deleted successfully"
  });
});

// activate a subscription 
const activateSubscription = asyncHandler(async (req, res) => {
    const subscription_id = req.params.id; 
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the subscription
        const subscription = await Subscription.findById(subscription_id).session(session);
        if (!subscription) {
            await session.abortTransaction();
            return res.status(NOT_FOUND).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        // Check if user already has an active (non-expired) subscription
        const existingActive = await activeSubscriptionsModel.findLatestActive(userId);
        if (existingActive) {
            await session.abortTransaction();
            return res.status(BAD_REQUEST).json({
                success: false,
                message: 'You already have an active subscription',
                data: {
                    currentSubscription: existingActive,
                    expiresAt: existingActive.deadline
                }
            });
        }

        // Get user details and check balance
        const user = await User.findById(userId).session(session);
        if (user.money < subscription.price) {
            await session.abortTransaction();
            return res.status(BAD_REQUEST).json({
                success: false,
                message: 'Insufficient funds'
            });
        }

        // Deduct money from user account
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { money: -subscription.price } },
            { new: true, session }
        );

        // Calculate expiry date
        const startDate = new Date();
        const expiryDate = new Date(startDate.getTime() + (subscription.duration_in_days * 24 * 60 * 60 * 1000));

        // Create active subscription
        const activeSubscription = await activeSubscriptionsModel.create([{
            subscription: subscription._id,
            user: userId,
            start_date: startDate,
            deadline: expiryDate
        }], { session });

        // Create transaction record
        const transaction = await Transaction.create([{
            user: userId,
            amount: subscription.price,
            type: 'SUBSCRIPTION',
            description: `Subscription purchase: ${subscription.name}`
        }], { session });

        await session.commitTransaction();

        // Send confirmation email
        try {
            await sendSubscriptionActivationEmail(
                user.email,
                user.name,
                subscription.name,
                subscription.price,
                subscription.duration_in_days,
                subscription.maximum_borrow,
                expiryDate
            );
        } catch (emailError) {
            console.error('Failed to send subscription email:', emailError);
            // Don't fail the transaction if email fails
        }

        res.status(CREATED).json({
            success: true,
            data: {
                activeSubscription: activeSubscription[0],
                transaction: transaction[0],
                remainingBalance: updatedUser.money
            }
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

const deactivateSubscription = asyncHandler(async (req, res, next) => {
  const subscription_id = req.params.id; // Get subscription ID from URL parameter
  const activeSubscription = await activeSubscriptionsModel.findByIdAndDelete(subscription_id);
  if (!activeSubscription) {
    res.status(NOT_FOUND).json({
      success: false,
      message: 'Active subscription not found'
    });
  }
  res.status(NO_CONTENT).json({
    success: true,
    message: 'Active subscription deleted successfully'
  });
});

module.exports = { 
  getSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription, 
  activateSubscription, 
  deactivateSubscription,
};

