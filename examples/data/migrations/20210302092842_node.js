/**
 * @param {import('knex')} knex 
 */
exports.up = function(knex) {
  return knex.schema.createTable('node', table => {
    table.increments('nid');

    table.text('bundle').notNullable();
  });
};

/**
 * @param {import('knex')} knex 
 */
exports.down = function(knex) {
  knex.schema.dropTableIfExists('node');
};
