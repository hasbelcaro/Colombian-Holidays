// Success response
exports.success = function (req, res, message, status) {
  res.status(status || 200).send({
    "error": 0,
    "status": true,
    "body": message
  });
}

// Error response
exports.error = function (req, res, message, status, details) {
  console.log('[Response Error] ' + details);

  res.status(status || 500).send({
    "error": message,
    "body": ""
  });
}
