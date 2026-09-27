const Product = require("../models/Product");

exports.create = async (req, res, next) => {
    try {
        const product = await Product.create({
            ...req.body,
            createdBy: req.user.id,
        });

        res.status(201).json({ product });
        
    } catch (error) {
        next(error);
    }
};

exports.list = async (_req, res, next) => {
    try {
        res.json({
            products: await Product.find()
                .sort({ createdAt: -1 })
                .populate("createdBy", "name email"),
        });
        
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "createdBy",
            "name email",
        );

        if (!product)
            return res.status(404).json({ message: "Product not found." });
        res.json({ product });

    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product)
            return res.status(404).json({ message: "Product not found." });
        res.json({ product });

    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product)
            return res.status(404).json({ message: "Product not found." });
        res.json({ message: "Product deleted." });

    } catch (error) {
        next(error);
    }
};
