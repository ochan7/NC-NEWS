const router = require('express').Router();

router.route('/')
  .get((req,res) => {
    res.status(200).send({status: 'OK'});
  });

router.use('/articles', require('./articles'));
router.use('/topics', require('./topics'));
module.exports = router;