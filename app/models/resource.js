class Resource {
  constructor(uri, properties = {}, relationships = {}) {
    this.uri = uri,
    this.properties = properties;
    this.relationships = relationships;
  }

  serialize() {
    return {
      uri: this.uri,
      properties: this.properties,
      relationships: this.relationships
    };
  }

  static deserialize(json) {
    var data = typeof json == 'string' ? JSON.parse(json) : json;
    return new Resource(
      data.uri,
      data.properties,
      data.relationships
    );
  }
}

module.exports = Resource;
