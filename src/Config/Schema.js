module.exports = class Schema {

  constructor(config) {
    this.config = config;
    this._wire = null;
  }

  get type() {
    return this.config.type;
  }

  get table() {
    return this.config.table;
  }

  get wire() {
    if (this._wire === null) {
      this._wire = {
        from: this.config.wireFrom || this.config.wire,
        to: this.config.wireTo || this.config.wire,
      };
    }
    return this._wire;
  }

}