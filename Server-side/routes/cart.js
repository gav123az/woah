const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { verify } = require("../auth");
const { rejectAdmin, validateAddToCart, validateChangeQuantity } = require("../validators/cartValidator");

router.get("/get-cart", verify, rejectAdmin, cartController.getUserCart );

router.post( "/add-to-cart", verify, rejectAdmin, validateAddToCart, cartController.addToCart );

router.patch("/update-cart-quantity", verify, rejectAdmin, validateChangeQuantity, cartController.changeQuantity );

router.patch("/:productId/remove-from-cart", verify, rejectAdmin, cartController.removeFromCart);

router.put("/clear-cart", verify, rejectAdmin, cartController.clearCart);

module.exports = router;
