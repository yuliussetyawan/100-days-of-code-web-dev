function enableCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS" // OPTIONS is automatically sent request by the browser  when use ajax requests. So we should add options here.
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}

module.exports = enableCors;
