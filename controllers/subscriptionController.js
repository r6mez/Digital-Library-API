const Subscription = require('../models/subscriptionModel');
const activeSubscriptionsModel = require('../models/activeSubscribtionModel');
const asyncHandler = require('../utils/asyncHandler');

 
// get all subscriptions
/**
 * @swagger
 * /api/v1/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     description: Retrieve a list of all subscriptions for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 */
const getSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    data: subscriptions
  });
});

// create a new subscription
/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     description: Create a new subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               maximum_borrow:
 *                 type: integer
 *               price:
 *                 type: number
 *               duration_in_days:
 *                 type: integer
 *             required:
 *               - name
 *               - maximum_borrow
 *               - price
 *               - duration_in_days
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Subscription'
 */
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
/**
 * @swagger
 * /api/v1/subscriptions/{id}:
 *   put:
 *     summary: Update a subscription
 *     description: Update an existing subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subscription to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maximum_borrow:
 *                 type: integer
 *               price:
 *                 type: number
 *               duration_in_days:
 *                 type: integer
 *             required:
 *               - maximum_borrow
 *               - price
 *               - duration_in_days
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Subscription'
 */
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
/**
 * @swagger
 * /api/v1/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     description: Delete an existing subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subscription to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Subscription deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 */
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
/**
 * @swagger
 * /api/v1/subscriptions/activate:
 *   post:
 *     summary: Activate a subscription
 *     description: Activate a subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               deadline:
 *                 type: string
 *                 format: date
 *             required:
 *               - subscription_id
 *               - start_date
 *               - deadline
 *     responses:
 *       201:
 *         description: Subscription activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ActiveSubscription'
 */
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


/**
 * @swagger
 * /api/v1/subscriptions/deactivate:
 *   post:
 *     summary: Deactivate a subscription
 *     description: Deactivate a subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: string
 *             required:
 *               - subscription_id
 *     responses:
 *       204:
 *         description: Subscription deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 */
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

