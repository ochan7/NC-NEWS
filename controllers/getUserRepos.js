const {Articles, Comments} = require('../models');

module.exports = (req, res, next) => {
  const {username:created_by} = req.params;
  const requests  = [
    Articles.find({created_by}),
    Comments.find({created_by})
  ];
  return Promise.all(requests)
    .then(data => {
      res.status(200).send({
        articles: data[0],
        comments: data[1]
      });
    })
    .catch(err => {
      return next({status: 404, message: 'USERNAME NOT FOUND'});
    });
};