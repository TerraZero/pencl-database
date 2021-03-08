/**
 * @param {import('knex')} knex 
 */
exports.up = function(knex) {
  return knex.schema.createTable('field_reference', table => {
    table.increments();
    table.text('field');
    table.text('type');
    table.integer('entity_id');
    table.integer('delta');
    table.text('target_type');
    table.integer('target_id');
  });
};

/**
 * @param {import('knex')} knex 
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('field_reference');
};
