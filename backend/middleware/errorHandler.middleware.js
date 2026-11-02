
const errorHandler = (err, req, res, next) => {
    if(res.headersSent) {
        return next(err)
    }

    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: statusCode >= 500 ? "Internal server Error" : err.message
    }

    if(err.details) {
        response.errors = err.details
    }

    if(statusCode >= 500) {
        console.log(err)
    }

   return res.status(statusCode).json(response)
}

export default errorHandler;