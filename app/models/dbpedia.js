const config = require('../../config'),
      sparqlQueryBuilder = require('../utils/sparql-query-builder'),
      sparqlClient = require('sparql-client'),
      util = require('util');

/* To be moved to its own file */
class Resource {
  constructor(uri, properties = {}, relationships = {}) {
    this.uri = uri,
    this.properties = properties;
    this.relationships = relationships;
  }
}

class DBPedia {
  constructor() {
    this.resources = {};
    this.anchor_resources = [];
  }

  addAnchors(anchors) {
    this.anchor_resources.push(...anchors.filter(anchor => !(anchor in this.anchor_resources)));
  }

  fetch(onSuccess, onFail) {
    var resources_to_fetch = this.anchor_resources.filter(anchor => !this.resources[anchor]);
    var query = sparqlQueryBuilder.DBPedia.fetch(resources_to_fetch);
    var client = new sparqlClient(config.DBPEDIA_ENDPOINT);

    client.query(query)
      .execute((err, results) => {
        if(err) onFail(err);
        else onSuccess(results);
      });
  }

  getResources() { return this.resources; }

  _createResourceFromSparqlResult(result) {
    /* To be implemented */
  }
}

module.exports = DBPedia;
