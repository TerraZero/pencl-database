const PenclBoot = require('pencl-base');
const PenclPlugin = require('pencl-base/src/Boot/PenclPlugin');

class PenclDatabase extends PenclPlugin {

  get name() {
    return 'database';
  }

  get config() {
    return {
      config: {
        data: null,
        file: '~/knexfile.js',
        schema: 'schema.*', /** @todo use 'schema.data.*' instead and add 'schema.table.*' pattern for table definition */
      },
      env: 'development',
    };
  }

  constructor() {
    super();
    this._manager = null;
  }

  /** @returns {import('./src/Manager/DatabaseManager')} */
  get manager() {
    if (this._manager === null) {
      const DatabaseManager = require('./src/Manager/DatabaseManager');
      const configManager = require('pencl-config').manager;

      if (this.config.config.file) {
        this.config.config.data = require(PenclBoot.getPath(this.config.config.file));
      }

      this._manager = new DatabaseManager(this.config.config.data, this.config.config.env);
      for (const config of configManager.list(this.config.config.schema)) {
        this._manager.load(configManager.get(config));
      }
    }
    return this._manager;
  }

}

module.exports = new PenclDatabase();