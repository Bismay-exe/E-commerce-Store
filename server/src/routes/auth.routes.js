const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const controller = require("../controllers/auth.controller");


const registerRules = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters."),

    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters."),
        
    body("confirmPassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match."),
];

router.post("/register", registerRules, validate, controller.register);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .normalizeEmail()
            .withMessage("Enter a valid email."),
        body("password").notEmpty().withMessage("Password is required."),
    ],
    validate,
    controller.login,
);

router.post("/refresh-token", controller.refresh);
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.me);

module.exports = router;
