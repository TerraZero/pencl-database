
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('node').del()
    .then(function () {
      // Inserts seed entries
      return knex('node').insert([
        {
          nid: 1, 
          bundle: 'page',
        },
        {
          nid: 2, 
          bundle: 'page',
        },
        {
          nid: 3, 
          bundle: 'text',
        },
      ]);
    });
};
