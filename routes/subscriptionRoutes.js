const express = require('express');
const router = express.Router();
const { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, activateSubscription, deactivateSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');
const { createSubscriptionSchema } = require('../validators/subscriptionValidator');
const validate = require('../validators/validate');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getSubscriptions);
router.post('/:id/activate', protect, activateSubscription);

router.post('/', protect, admin, validate(createSubscriptionSchema), createSubscription);
router.put('/:id', protect, admin, validate(createSubscriptionSchema), updateSubscription);
router.delete('/:id', protect, admin, deleteSubscription);
router.delete('/:id/deactivate', protect, admin, deactivateSubscription);

module.exports = router;
