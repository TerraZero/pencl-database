module.exports = class Entity {

  /**
   * @param {import('../Manager/DatabaseManager')} manager 
   * @param {import('../Config/Schema')} schema
   * @param {*} data 
   */
  constructor(manager, schema, data) {
    this.manager = manager;
    this.schema = schema;
    this.data = data;
    this._fields = {};
  }

  async get(field) {
    const key = this.schema.prop(field);

    if (key) return this.data[key];

    if (this._fields[field]) {
      return this._fields[field];
    } else {
      this._fields[field] = await this.manager.query()
        .from(this.schema.table)
        .select(field)
        .condition(this.schema.prop('id'), await this.get('id'))
        .sort(field + '.' + (this.schema.prop('delta') || 'delta'))
        .query;
      return this._fields[field];
    }
  }

  async getValue(field, index = null) {
    const schema = this.manager.schema(field).values;
    const values = await this.get(field);

    if (index === null) {
      const data = [];
      for (const value of values) {
        const item = {};
        for (const name of schema) {
          item[name] = value[name];
        }
        data.push(item);
      }
      return data;
    } else {
      if (schema.length === 1) return values[index][schema[0]];
      
      const item = {};
      for (const name of schema) {
        item[name] = values[index][name];
      }
      return item;
    }
  }

}