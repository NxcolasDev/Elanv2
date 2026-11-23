function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const candidate = err.statusCode || err.status;
  const status = Number.isInteger(candidate) && candidate >= 400 && candidate <= 599 ? candidate : 500;
  if (status >= 500) console.error(JSON.stringify({ event: "http.error", status, method: req.method, code: err.code }));
  const error = err.type === "entity.parse.failed" ? "JSON inválido." :
    status === 500 ? "Internal server error" : err.message;
  return res.status(status).json({ error, ...(String(err.code).startsWith("AI_") && { code: err.code }) });
}

module.exports = errorHandler;
