module.exports = class TableSchema {

  /**
   * @param {import('../Manager/DatabaseManager')} manager
   * @param {string} table
   */
  constructor(manager, table) {
    this.table = table;
    this.manager = manager;
    this._info = null;
    this._fields = null;
  }

  info() {
    if (this._info === null) {
      return this.manager.connection()('sqlite_master').where('type', 'table').where('name', this.table).then((schema) => {
        if (schema[0] === undefined) throw Error('SCHEMA_ERROR: no such table: ' + this.table);
        this._info = schema[0];
        return this._info;
      });
    } else {
      return Promise.resolve(this._info);
    }
  }

  async fields() {
    if (this._fields === null) {
      this._fields = {};
      const info = await this.info();

      for (const string of info.sql.match(/^[^(]*\((.*)\)[^)]*$/)[1].split(',')) {
        const name = string.match(/^[^`]*`([^`]*)`.*$/)[1];
  
        if (string.indexOf('foreign key') !== -1) {
          const match = string.match(/^.*references `([^`]*)`\(`([^`]*)`.*$/);
  
          this._fields[name].foreign = {
            table: match[1],
            field: match[2],
          };
        } else {
          this._fields[name] = {
            name: string.match(/^[^`]*`([^`]*)`.*$/)[1],
            type: string.trim().split(' ')[1],
            notNull: string.indexOf('not null') !== -1,
            primary: string.indexOf('primary key') !== -1,
            autoincrement: string.indexOf('autoincrement') !== -1,
            foreign: false,
          };
        }
      }
    }
    return this._fields;
  }

}
