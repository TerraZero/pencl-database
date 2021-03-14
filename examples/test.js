const Boot = require('pencl-base');

Boot(__dirname);

const Database = require('../index');
const manager = Database.manager;

const query = manager.query()
  .from('node', 'n')
  .select('n');

query.or()
  .condition('field_text.value', 'Text 1')
  .condition('field_line.value', 'Text 4');

(async function() {
  console.log(await manager.schema('field_text').tableSchema.fields());
  console.log('=================');
  console.log(query.string);
  console.log(await query.query);
  console.log('=================');
  const node = await manager.storage.load('node', 1);
  console.log(await node.getValue('field_ref', 0));
  console.log(await manager.getTable());

  manager.destroy();
})();