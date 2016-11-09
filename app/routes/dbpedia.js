var express = require('express');
var router = express.Router();
var DBPedia = require('../models/dbpedia');

router.get('/:ids', (req, res) => {
  var model = new DBPedia();

  model.addAnchors(req.params.ids.split(';').map(id => `http://dbpedia.org/resource/${id}`));

  model.fetch((results) => {
    res.json(results);
  })
});

module.exports = router;
