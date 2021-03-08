module.exports = class Schema {

  /**
   * @param {import('pencl-config/src/Config')} config 
   * @param {import('../Manager/DatabaseManager')} manager
   */
  constructor(config, manager) {
    this.config = config;
    this._wire = null;
    this.manager = manager;
  }

  get type() {
    return this.config.get('type');
  }

  get table() {
    return this.config.get('table');
  }

  get name() {
    return this.config.get('name');
  }

  get props() {
    return this.config.get('props', {});
  }

  get values() {
    return this.config.get('values', ['value']);
  }

  get wire() {
    if (this._wire === null) {
      this._wire = {
        from: this.config.get('wireFrom') || this.config.get('wire'),
        to: this.config.get('wireTo') || this.config.get('wire'),
      };
    }
    return this._wire;
  }

  /**
   * @returns {import('./TableSchema')}
   */
  get tableSchema() {
    return this.manager.table(this.table);
  }

  prop(key) {
    return this.props[key];
  }

}