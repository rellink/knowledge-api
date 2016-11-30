var builder = {
  DBPedia: {
    fetch: (rscQuery) => `
      SELECT ?rsc (GROUP_CONCAT(?rel ; separator=";") as ?rels_type) (GROUP_CONCAT(DISTINCT ?subj ; separator=";") as ?rels_subj)
      WHERE {
        ?rsc ?rel ?subj .
        ?subj rdfs:label ?label .
        FILTER regex(?subj,'dbpedia.org','i') .
        FILTER (langMatches(lang(?label),'en')) .
        ${rscQuery}
      }
      GROUP BY ?rsc
    `,
    fetchByAnchors: (uris, incoming = false) => builder.DBPedia.fetch(`
      {
        SELECT DISTINCT (?rsc)
        WHERE {
          {
            VALUES (?anchor) { ${uris.map(uri => `(<${uri}>)`).join(' ')} }
            ?anchor ?rel ?rsc .
            ?rsc rdfs:label ?label .
			      FILTER regex(?rsc,'dbpedia.org','i') .
            FILTER (langMatches(lang(?label),'en')) .
          }
          ${incoming ? `
            UNION
            {
              VALUES (?anchor) { ${uris.map(uri => `(<${uri}>)`).join(' ')} }
              ?rsc ?rel ?anchor .
              ?rsc rdfs:label ?label .
  			      FILTER regex(?rsc,'dbpedia.org','i') .
              FILTER (langMatches(lang(?label),'en')) .
            }
          `:``}
          UNION
          {
            VALUES (?anchor) { ${uris.map(uri => `(<${uri}>)`).join(' ')} }
            BIND (?anchor AS ?rsc)
          }
        }
      }
    `),
    fetchByResources: (uris) => builder.DBPedia.fetch(`
      VALUES (?rsc) { ${uris.map(uri => `(<${uri}>)`).join(' ')} }
    `)
  }
}

module.exports = builder;
