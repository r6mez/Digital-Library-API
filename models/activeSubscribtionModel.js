
const mongoose = require('mongoose');

const activeSubscriptionSchema = new mongoose.Schema({
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    }
}, { timestamps: true });

// Instance method to check if subscription is expired
activeSubscriptionSchema.methods.isExpired = function() {
    return new Date() > this.deadline;
};

// Static method to find all active (non-expired) subscriptions
activeSubscriptionSchema.statics.findActive = function(filter = {}) {
    return this.find({
        ...filter,
        deadline: { $gt: new Date() }
    }).sort({ createdAt: -1 }); // Most recent first
};

// Static method to find the latest active subscription for a user
activeSubscriptionSchema.statics.findLatestActive = function(userId) {
    return this.findOne({
        user: userId,
        deadline: { $gt: new Date() }
    }).sort({ createdAt: -1 }).populate('subscription');
};

// Static method to find all subscriptions for a user (including expired)
activeSubscriptionSchema.statics.findUserHistory = function(userId) {
    return this.find({
        user: userId
    }).sort({ createdAt: -1 }).populate('subscription');
};

module.exports = require('mongoose').model('ActiveSubscription', activeSubscriptionSchema);