// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './examples/data/database.sqlite3',
    },
    migrations: {
      directory: './examples/data/migrations',
    },
    seeds: {
      directory: './examples/data/seeds',
    },
    useNullAsDefault: true,
  },

};
