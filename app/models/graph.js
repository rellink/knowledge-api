class Graph {
  constructor(resources = new Map()) {
    this.resources = resources;
  }

  addResource(resource) {
    this.resources.add(resource);
  }

  get nodes() {
    return [...this.resources.values()];
  }

  get edges() {
    var edges = [];
    for(var resource of this.resources.values()) {
      Object.keys(resource.relationships).forEach((uri) => {
        if(this.resources.has(uri))
          edges.push({
            s: resource.uri,
            t: uri,
            r: resource.relationships[uri]
          })
      });
    }
    return edges;
  }

  serialize() {
    return {
      nodes: this.nodes.map(node => ({ uri: node.uri, properties: node.properties })),
      edges: this.edges
    };
  }
}

module.exports = Graph;
