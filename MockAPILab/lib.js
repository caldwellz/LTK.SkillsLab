function sendStatus(res, code, message) {
  res.status(code).json({ status: code, message });
}

function useAsyncHandler(func) {
  return (req, res, next) => {
    func(req, res, next)
      .then((data) => {
        if (data !== undefined) {
          res.json(data);
        }
      })
      .catch((err) => {
        console.error(err);
        sendStatus(res, 500, 'Internal server error');
      });
  };
}

module.exports = {
  sendStatus,
  useAsyncHandler,
};
