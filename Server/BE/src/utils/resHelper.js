module.exports = function resHelper(res, result) {
  res.send(result[0]).status(result[1]);
}