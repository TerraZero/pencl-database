const Entity = require('./Entity');

module.exports = class Storage {

  /**
   * @param {import('../Manager/DatabaseManager')} manager 
   */
  constructor(manager) {
    this.manager = manager;
  }

  async load(type, id) {
    const schema = this.manager.schema(type);
    const value = await this.manager.query().from(schema.table, 'n').select('n').condition('id', id).query;
    return new Entity(this.manager, schema, value[0]);
  }

}