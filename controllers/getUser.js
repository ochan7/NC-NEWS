const {Users} = require('../models');

module.exports = (req, res, next) => {
  const {username} = req.params;
  Users.find({username})
    .then(users => {
      if(users.length === 0) return next({status: 404, message: 'USERNAME NOT FOUND'});
      res.status(200).send({users});
    })
    .catch(err => {
      if(err) return next(err);
    });
};