module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
    // .catch(next) is same as above, it will pass the err argument directly.
  };
};
