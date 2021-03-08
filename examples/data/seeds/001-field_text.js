
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('field_text').del()
    .then(function () {
      // Inserts seed entries
      return knex('field_text').insert([
        {
          id: 1, 
          field: 'field_text',
          type: 'page',
          entity_id: 1,
          delta: 0,
          value: 'Text 1',
        },
        {
          id: 2, 
          field: 'field_text',
          type: 'page',
          entity_id: 1,
          delta: 1,
          value: 'Text 2',
        },
        {
          id: 3, 
          field: 'field_text',
          type: 'text',
          entity_id: 3,
          delta: 0,
          value: 'Text 3',
        },
        {
          id: 4, 
          field: 'field_line',
          type: 'page',
          entity_id: 2,
          delta: 0,
          value: 'Text 4',
        },
        {
          id: 5, 
          field: 'field_line',
          type: 'page',
          entity_id: 1,
          delta: 2,
          value: 'Text 5',
        },
      ]);
    });
};
