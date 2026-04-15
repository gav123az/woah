const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

module.exports.checkout = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        if (req.user.isAdmin) {
            return res.status(403).send({ error: "Admins are not allowed to checkout." });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return res.status(400).send({ error: "No items in cart to checkout." });
        }

        const order = new Order({
            userId,
            productsOrdered: cart.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice: cart.totalPrice
        });
        await order.save();
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        return res.status(201).send({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getMyOrders = async (req, res) => {
    try {
        if (req.user && req.user.isAdmin) {
            return res.status(403).send({ error: "You do not have permission to access this resource." });
        }
        const userId = req.user && (req.user.id || req.user._id);
        const orders = await Order.find({ userId });
        if (!orders || orders.length === 0) {
            return res.status(404).send({ error: "No orders found." });
        }
        return res.status(200).send({ orders });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getAllOrders = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).send({ error: "Access denied: Admins only." });
        }
        const orders = await Order.find();
        return res.status(200).send({ orders });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ error: "Order not found." });
        }

        const titleCase = (val) => {
            if (typeof val !== "string") return val;
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        };
        const normalizedNewStatus = titleCase(status);
        if (order.status === normalizedNewStatus) {
            return res.status(200).send({
                message: "Order status already set to this value.",
                updatedOrder: order
            });
        }
        order.status = normalizedNewStatus;
        await order.save();

        return res.status(200).send({
            message: "Order status updated successfully.",
            updatedOrder: order
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
