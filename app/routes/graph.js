var express = require('express');
var router = express.Router();
var DBPedia = require('../models/dbpedia');
var sparql = require('../utils/sparql');
var Graph = require('../models/graph');

router.get('/', (req, res, next) => {
  if(!req.query.anchors) {
    res.status(403).send('Usage: /graph?anchors=<comma-separated anchors>');
    return;
  }
  var anchors = req.query.anchors.split(',');

  var model = new DBPedia();
  model.addAnchors(anchors.map(id => sparql.resolvePrefix(id)));

  model
    .fetch()
    .then(() => {
      var graph = new Graph(model.resources);
      res.json(graph.serialize());
    });
});

module.exports = router;
