const Subscription = require('../models/subscriptionModel');
const activeSubscriptionsModel = require('../models/activeSubscribtionModel');
const asyncHandler = require('../utils/asyncHandler');

 
// get all subscriptions
const getSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    data: subscriptions
  });
});

// create a new subscription
const createSubscription = asyncHandler(async (req, res, next) => {
  const { name, maximum_borrow, price, duration_in_days } = req.body;
  const subscription = await Subscription.create({
    user: req.user._id,
    name,
    maximum_borrow,
    price,
    duration_in_days
  });
  res.status(201).json({
    success: true,
    data: subscription
  });
});

// update a subscription
const updateSubscription = asyncHandler(async (req, res, next) => {
  const { maximum_borrow, price, duration_in_days } = req.body;
  const subscription = await Subscription.findByIdAndUpdate(req.params.id, {
    maximum_borrow,
    price,
    duration_in_days
  }, { new: true });
  if (!subscription) {
    res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
  }
  res.status(200).json({
    success: true,
    data: subscription
  });
});

// delete a subscription
const deleteSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findByIdAndDelete(req.params.id);
  if (!subscription) {
    res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
  }
  res.status(204).json({
    success: true,
    data: null
  });
});

// activate a subscription free and add it to activeSubscriptionsModel
const activateSubscription = asyncHandler(async (req, res, next) => {
    const { subscription_id, start_date, deadline } = req.body;
    const subscription = await Subscription.findById(subscription_id);
    if (!subscription) {
      res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
    }
    const activeSubscription = await activeSubscriptionsModel.create({
        subscription_id,
        user_id: req.user._id,
        start_date,
        deadline,
        remaining_borrows: subscription.maximum_borrow
    });
    res.status(201).json({
        success: true,
        data: activeSubscription
    });
});

const deactivateSubscription = asyncHandler(async (req, res, next) => {
  const { subscription_id } = req.body;
  const activeSubscription = await activeSubscriptionsModel.findByIdAndDelete(subscription_id);
  if (!activeSubscription) {
    res.status(404).json({
      success: false,
      message: 'Active subscription not found'
    });
  }
  res.status(204).json({
    success: true,
    data: null
  });
});

module.exports = { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, activateSubscription, deactivateSubscription };

