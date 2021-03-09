const PenclPlugin = require('pencl-base/src/Boot/PenclPlugin');

class PenclDatabase extends PenclPlugin {

  static get name() {
    return 'database';
  }

  static get config() {
    return {
      hallo: 'ok',
    };
  }

}

module.exports = new PenclDatabase();