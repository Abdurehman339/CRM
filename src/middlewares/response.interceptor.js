module.exports = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (data) => {
    const wrappedResponse = {
      success: res.statusCode < 400,
      statusCode: res.statusCode,
      data,
      timestamp: new Date().toISOString(),
    };

    return originalJson(wrappedResponse);
  };

  next();
};
