const router = require('express').Router();
const {
  getAllUsers, 
  getUser,
  getUserRepos
} = require('../controllers');

router.route('/')
  .get(getAllUsers);
router.route('/:username')
  .get(getUser);
router.route('/:username/repos')
  .get(getUserRepos);
  
module.exports = router; 