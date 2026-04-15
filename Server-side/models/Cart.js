const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    cartItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Minimum quantity is 1']
        },
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
            min: [0, 'Subtotal must be a positive number']
        }
    }],
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price must be a positive number']
    },
    orderedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);
