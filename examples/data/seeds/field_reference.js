
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('field_reference').del()
    .then(function () {
      // Inserts seed entries
      return knex('field_reference').insert([
        {
          id: 1, 
          field: 'field_ref',
          type: 'page',
          entity_id: 1,
          delta: 0,
          target_type: 'page',
          target_id: 2,
        },
        {
          id: 2, 
          field: 'field_ref',
          type: 'page',
          entity_id: 2,
          delta: 0,
          target_type: 'text',
          target_id: 3,
        },
      ]);
    });
};
