const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");
const { validateUpdateOrderStatus } = require("../validators/orderValidator");

router.patch("/:orderId/status", verify, verifyAdmin, validateUpdateOrderStatus, orderController.updateOrderStatus);

router.post("/checkout", verify, orderController.checkout);

router.get("/my-orders", verify, orderController.getMyOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
