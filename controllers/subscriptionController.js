const Subscription = require('../models/subscriptionModel');
const asyncHandler = require('../utils/asyncHandler');

 
// get all subscriptions
const getSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ user: req.body.id });
  res.status(200).json({
    success: true,
    data: subscriptions
  });
});

// create a new subscription
const createSubscription = asyncHandler(async (req, res, next) => {
  const { name, maximum_borrow, price, duration_in_days } = req.body;
  const subscription = await Subscription.create({
    user: req.body.id,
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
    return next(new ErrorResponse(`Subscription not found`, 404));
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
    return next(new ErrorResponse(`Subscription not found`, 404));
  }
  res.status(204).json({
    success: true,
    data: null
  });
});

// activate a subscription free and add it to activeSubscriptionsModel
const activateSubscription = asyncHandler(async (req, res, next) => {
    const { subscription_id, start_date, deadline } = req.body;
    const activeSubscription = await activeSubscriptionsModel.create({
        subscription_id,
        user_id: req.body.id,
        start_date,
        deadline
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
    return next(new ErrorResponse(`Active subscription not found`, 404));
  }
  res.status(204).json({
    success: true,
    data: null
  });
});

module.exports = { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, activateSubscription, deactivateSubscription };

