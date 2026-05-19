function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : err.message,
  });
}

module.exports = errorHandler;
