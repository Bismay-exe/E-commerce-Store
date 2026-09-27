const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const issueAccessToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
    );

const issueRefreshToken = (user) =>
    jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

const setRefreshCookie = (res, token) =>
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

const hashToken = (token) => bcrypt.hash(token, 10);


module.exports = {
    issueAccessToken,
    issueRefreshToken,
    setRefreshCookie,
    hashToken,
};
