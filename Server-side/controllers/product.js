const Product = require("../models/Product");
const { errorHandler } = require("../auth");

module.exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const existing = await Product.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
        if (existing) {
            return res.status(400).send({ error: "Product already created" });
        }
        if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
            return res.status(400).send({ error: "Stock is required and must be a non-negative number" });
        }
        const product = new Product({ name, description, price, stock: Number(stock) });
        await product.save();
        return res.status(201).send({ message: "Product created successfully", product });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).send({ products });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getActiveProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        return res.status(200).send({ products });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        return res.status(200).send({ product });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if (!product.isActive) {
            return res.status(403).send({ error: "Cannot update archived product" });
        }
        let changed = false;
        ['name','description','price','stock'].forEach(field => {
            if (updates[field] !== undefined) {
                const oldVal = (field === 'price' || field === 'stock')
                    ? String(product[field])
                    : product[field];
                const newVal = String(updates[field]);
                if (oldVal !== newVal) {
                    changed = true;
                }
            }
        });
        if (!changed) {
            return res.status(200).send({ message: "Product already updated", product });
        }
        for (const field of ['name','description','price','stock']) {
            if (updates[field] !== undefined) {
                if (field === 'price' || field === 'stock') {
                    const numVal = Number(updates[field]);
                    if (field === 'stock' && (isNaN(numVal) || numVal < 0)) {
                        return res.status(400).send({ error: "Stock must be a non-negative number." });
                    }
                    product[field] = numVal;
                } else {
                    product[field] = updates[field];
                }
            }
        }
        await product.save();
        return res.status(200).send({ success: true, message: "Product updated successfully" });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.archiveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if (!product.isActive) {
            return res.status(200).send({
                message: "Product already archived",
                archivedProduct: product
            });
        }
        product.isActive = false;
        await product.save();
        return res.status(200).send({ success: true, message: "Product archived successfully" });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.activateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if (product.isActive) {
            return res.status(200).send({
                message: "Product already active",
                activateProduct: product
            });
        }
        product.isActive = true;
        await product.save();
        return res.status(200).send({ success: true, message: "Product activated successfully" });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.searchProductsByName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).send({ error: "Search 'name' parameter is required in body." });
        }
        const products = await Product.find({ name: { $regex: name, $options: 'i' } });
        return res.status(200).send({ products });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.searchProductsByPriceRange = async (req, res) => {
    try {
        let { minPrice, maxPrice } = req.body;
        minPrice = minPrice !== undefined ? Number(minPrice) : 0;
        maxPrice = maxPrice !== undefined ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;

        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).send({ error: "Body parameters 'minPrice' and 'maxPrice' must be numbers." });
        }
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        return res.status(200).send({ products });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
