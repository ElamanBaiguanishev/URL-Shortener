const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message,
        }));

        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors,
        });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    console.error("Unexpected Error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

module.exports = errorHandler;
