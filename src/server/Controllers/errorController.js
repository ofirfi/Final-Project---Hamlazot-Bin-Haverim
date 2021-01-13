const AppError = require('../utils/appError');

const handleCastErrorDB = err => new AppError(`Invalid ${err.path}: is ${err.value}.`, 400)

const handleDuplicateFieldsDB = err => {
    const dupField = Object.keys(err.keyValue)[0];
    const message = `Duplicated field '${err.keyValue[dupField]}'. please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Please log in again', 401)

const handleJwtExpired = err => new AppError(`Token expired. Please log in again`, 401)


const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else
        res.status(500).json({
            status: "error",
            message: "Something went wrong!"
        })
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    let error = { ...err };
    error.message = err.message;
    
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.errors) error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError") error = handleJwtExpired(error)
    sendErrorProd(error, res);
    // sendErrorDev(error,res );

}