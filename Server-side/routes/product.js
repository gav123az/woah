const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const productController = require("../controllers/product");
const { validateCreateProduct, validateUpdateProduct, validateSearchByPriceRange, validateSearchByName } = require("../validators/productValidator");

router.post("/search-by-name", validateSearchByName, productController.searchProductsByName);

router.post("/search-by-price", validateSearchByPriceRange, productController.searchProductsByPriceRange);

router.post("/", verify, verifyAdmin, validateCreateProduct, productController.createProduct);

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.get("/active", productController.getActiveProducts);

router.get("/:productId", productController.getProductById);

router.patch("/:productId/update", verify, verifyAdmin, validateUpdateProduct, productController.updateProduct);

router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

module.exports = router;
