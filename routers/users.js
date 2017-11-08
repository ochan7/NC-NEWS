const router = require('express').Router();
const {getAllUsers, getUser} = require('../controllers');
router.route('/')
  .get(getAllUsers);
router.route('/:username')
  .get(getUser);
module.exports = router; 