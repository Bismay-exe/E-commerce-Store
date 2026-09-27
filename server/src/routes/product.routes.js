const router = require("express").Router();
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/product.controller");


const idRule = [
    param("id").isMongoId().withMessage("Product id must be valid."),
];

const productRules = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters."),

    body("description")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Description must be at least 5 characters."),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number.")
        .toFloat(),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative whole number.")
        .toInt(),
        
    body("imageUrl")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Image URL must be valid."),
];

router.get("/", controller.list);

router.get("/:id", idRule, validate, controller.getOne);

router.post("/", authenticate, productRules, validate, controller.create);

router.put(
    "/:id",
    authenticate,
    idRule,
    productRules,
    validate,
    controller.update,
);

router.delete("/:id", authenticate, idRule, validate, controller.remove);


module.exports = router;
