const Knex = require('knex');
const Query = require('../Builder/Query');
const Schema = require('../Config/Schema');
const TableSchema = require('../Config/TableSchema');
const Storage = require('../Entity/Storage');

module.exports = class DatabaseManager {

  constructor(config, env = 'development') {
    this.config = config;
    this.env = env;
    this._connections = {};
    this._schemas = {};
    this._tables = {};
    this._storage = null;
  }

  /**
   * @returns {Storage}
   */
  get storage() {
    if (this._storage === null) {
      this._storage = new Storage(this);
    }
    return this._storage;
  }

  /**
   * @param {string} env 
   * @returns {Knex}
   */
  connection(env = null) {
    env = env || this.env;
    if (this._connections[env] === undefined) {
      this._connections[env] = new Knex(this.config[env]);
    }
    return this._connections[env];
  }

  /**
   * @param {string} newEnv 
   * @returns {string} oldEnv
   */
  swap(newEnv) {
    const oldEnv = this.env;
    this.env = newEnv;
    return oldEnv;
  }

  /**
   * @param {import('pencl-config/src/Config')} config 
   */
  load(config) {
    const schema = new Schema(config, this);
    this._schemas[schema.name] = schema;
    return this;
  }

  /**
   * @param {string} name 
   * @returns {import('../Config/Schema')}
   */
  schema(name) {
    return this._schemas[name];
  }

  /**
   * @param {string} table 
   * @returns {TableSchema}
   */
  table(table) {
    if (this._tables[table] === undefined) {
      this._tables[table] = new TableSchema(this, table);
    }
    return this._tables[table];
  }

  /**
   * @param {string} env 
   * @returns {Query}
   */
  query(env = null) {
    return new Query(this, this.connection(env));
  }

  /**
   * @param {string} env 
   */
  destroy(env = null) {
    if (env) {
      this._connections[env].destroy();
    } else {
      for (const index in this._connections) {
        this._connections[index].destroy();
        delete this._connections[index];
      }
    }
  }

  /**
   * @param {string} env 
   * @returns {Promise<string[]>}
   */
  async getTable(env = null) {
    const tables = [];
    for (const row of await this.connection(env).select('*').from('sqlite_master').where('type', 'table')) {
      if (row.name.startsWith('knex') || row.name.startsWith('sqlite')) continue;
      tables.push(row.name);
    }
    return tables;
  }

}