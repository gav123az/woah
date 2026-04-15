const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { errorHandler } = require("../auth");

function recalculateTotalPrice(cart) {
    return cart.cartItems.reduce((t, item) => t + item.subtotal, 0);
}

module.exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        const cart = await Cart.findOne({ userId }).populate("cartItems.productId");
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: "Cart not found"
            });
        }
        return res.status(200).send({
            success: true,
            cart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.addToCart = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        const { productId, quantity } = req.body;

        if (!productId || typeof productId !== "string") {
            return res.status(400).send({
                success: false,
                message: "Invalid productId"
            });
        }
        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).send({
                success: false,
                message: "Quantity must be a positive number"
            });
        }

        const product = await Product.findById(productId);
        if (!product || product.isActive === false) {
            return res.status(400).send({
                success: false,
                message: "Product not found or inactive"
            });
        }

        let cart = await Cart.findOne({ userId });
        const computedSubtotal = product.price * quantity;

        if (!cart) {
            cart = new Cart({
                userId,
                cartItems: [{ productId, quantity, subtotal: computedSubtotal }],
                totalPrice: computedSubtotal
            });
        } else {
            const idx = cart.cartItems.findIndex(i => i.productId.equals(productId));
            if (idx > -1) {
                return res.status(409).send({
                    success: false,
                    message: "Item already in cart",
                    cart
                });
            }

            cart.cartItems.push({ productId, quantity, subtotal: computedSubtotal });
            cart.totalPrice = recalculateTotalPrice(cart);
        }

        const savedCart = await cart.save();
        return res.status(200).send({
            success: true,
            message: "Item added to cart successfully",
            cart: savedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.changeQuantity = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        const { productId, newQuantity } = req.body;

        if (!productId || typeof productId !== "string") {
            return res.status(400).send({
                success: false,
                message: "Invalid productId"
            });
        }
        if (typeof newQuantity !== "number" || newQuantity <= 0) {
            return res.status(400).send({
                success: false,
                message: "newQuantity must be a positive number"
            });
        }

        const product = await Product.findById(productId);
        if (!product || product.isActive === false) {
            return res.status(400).send({
                success: false,
                message: "Product not found or inactive"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: "Cart not found"
            });
        }
        const idx = cart.cartItems.findIndex(i => i.productId.equals(productId));
        if (idx === -1) {
            return res.status(404).send({
                success: false,
                message: "Item not found in cart"
            });
        }
        if (newQuantity === cart.cartItems[idx].quantity) {
            return res.status(409).send({
                success: false,
                message: "Item quantity already updated",
                updatedCart: cart
            });
        }

        cart.cartItems[idx].quantity = newQuantity;
        cart.cartItems[idx].subtotal = product.price * newQuantity;
        cart.totalPrice = recalculateTotalPrice(cart);

        const savedCart = await cart.save();
        return res.status(200).send({
            success: true,
            message: "Item quantity updated successfully",
            updatedCart: savedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        const productId = req.params.productId;

        if (!productId || typeof productId !== "string") {
            return res.status(400).send({
                success: false,
                message: "Invalid productId"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: "Cart not found"
            });
        }
        const idx = cart.cartItems.findIndex(i => i.productId.equals(productId));
        if (idx === -1) {
            return res.status(404).send({
                success: false,
                message: "Item not found in cart"
            });
        }
        cart.cartItems.splice(idx, 1);
        cart.totalPrice = recalculateTotalPrice(cart);

        const savedCart = await cart.save();
        return res.status(200).send({
            success: true,
            message: "Item removed from cart successfully",
            updatedCart: savedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: "Cart not found"
            });
        }
        if (cart.cartItems.length === 0 && cart.totalPrice === 0) {
            return res.status(409).send({
                success: false,
                message: "Cart is already cleared",
                cart
            });
        }
        cart.cartItems = [];
        cart.totalPrice = 0;

        const savedCart = await cart.save();
        return res.status(200).send({
            success: true,
            message: "Cart cleared successfully",
            cart: savedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
