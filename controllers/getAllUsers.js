const {Users} = require('../models');

module.exports = (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).send({users});
    })
    .catch(err => {
      if(err) return next(err);
    });
};