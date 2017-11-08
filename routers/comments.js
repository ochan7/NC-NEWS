const router = require('express').Router();
const {putComment} = require('../controllers');
router.route('/:comment_id')
  .put(putComment);

module.exports = router;