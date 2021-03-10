const Boot = require('pencl-base');

Boot(__dirname);

const Database = require('../index');
const query = Database.manager.query().from('node', 'n').select('n');

(async function() {
  console.log(await query.query);
  Database.manager.destroy();
})();