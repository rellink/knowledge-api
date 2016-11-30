var express = require('express');
var router = express.Router();

router.get('/search', (req, res, next) => {
  if(!req.query.q) {
    res.status(403).send('Usage: /entity/search?q=<keyword>');
    return;
  }
  var q = req.query.q;
  
  res.json(graph.serialize());
});

module.exports = router;
