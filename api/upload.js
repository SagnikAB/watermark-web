module.exports = async (req, res) => {
  res.status(200).json({
    ok: true,
    method: req.method,
    message: "Serverless function is working"
  });
};
