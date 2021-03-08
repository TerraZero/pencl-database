/**
 * @param {import('knex')} knex 
 */
exports.up = function(knex) {
  return knex.schema.createTable('field_text', table => {
    table.increments();
    table.text('field');
    table.text('type');
    table.integer('entity_id');
    table.integer('delta');
    table.text('value');
  });
};

/**
 * @param {import('knex')} knex 
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('field_text');
};
