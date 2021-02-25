const Knex = require('knex');

module.exports = class DatabaseManager {

  constructor(config, env = 'development') {
    this.config = config;
    this.env = env;
    this._connections = {};
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

}