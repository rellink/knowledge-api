var config = require('../../config');
var sparqlQueryBuilder = require('../utils/sparql-query-builder');
var sparqlClient = require('sparql-client');
var util = require('util');

var Resource = require('./resource');

class DBPedia {
  constructor() {
    this.resources = new Map(); /* Map of URIs to Resource */
    this.anchors = new Set(); /* Set of anchor URIs */
  }

  addAnchors(anchors) {
    anchors.forEach(anchor => this.anchors.add(anchor));
  }

  addResource(resource) {
    this.resources.set(resource.uri, resource);
  }

  getResources() {
    return this.resources;
  }

  /* Fetch all neccessary resources for building graphs with anchor points */
  fetch() {
    return new Promise((resolve, reject) => {
      this._fetchByAnchors(
          [...this.anchors.values()].filter(anchor => !this.resources.has(anchor))
        )
        .then(resolve)
        .catch(reject);
    });
  }

  _fetchByAnchors(uris, onSuccess, onFail) {
    var query = sparqlQueryBuilder.DBPedia.fetchByAnchors(uris, true);
    var client = new sparqlClient(config.DBPEDIA_ENDPOINT);

    return new Promise((resolve, reject) => {
      client.query(query)
        .execute((err, results) => {
          if(err) { reject(err); return; }
          results.results.bindings.forEach(r => {
            var resource = this._createResourceFromSparqlResult(r);
            this.resources.set(resource.uri, resource);
          });
          resolve(results);
        });
    });
  }

  _createResourceFromSparqlResult(result) {
    var uri = result.rsc.value;

    var rels_type = result.rels_type.value.split(';');
    var rels_subj = result.rels_subj.value.split(';');
    var relationships = rels_subj.reduce(
      (c, v, i) => Object.assign(c, {[v]: rels_type[i]}
    ), {});

    var properties = {};

    var resource = new Resource(uri, properties, relationships);
    return resource;
  }
}

module.exports = DBPedia;
