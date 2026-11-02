import AppError from "../utility/AppError.utility"

const notFound = (req, res, next) => {
    next(new AppError("Route Not Found", 404))
}

export default notFound