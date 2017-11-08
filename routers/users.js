const router = require('express').Router();
const {getAllUsers} = require('../controllers');
router.route('/')
  .get(getAllUsers);
module.exports = router; 