var builders = {
  DBPedia: {
    fetch: (uris) => `
      SELECT ?resource (GROUP_CONCAT(?relationship ; separator=";") as ?r) (GROUP_CONCAT(?property ; separator=";") as ?p)
      WHERE {
        ?resource ?relationship ?property .
        ?property rdfs:label ?label .
        FILTER (langMatches(lang(?label),'en')).
      }
      GROUP BY ?resource
      VALUES (?resource) {
        ${uris.map(uri => `(<${uri}>)`).join(' ')}
      }
    `
  }
}

module.exports = builders;
