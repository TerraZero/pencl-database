const QueryCondition = require('./QueryCondition');

/**
 * @typedef WireObject
 * @property {string} alias
 * @property {import('../Config/Schema')} schema
 * @property {string} [field]
 */

module.exports = class Query {

  static as(key, alias = null) {
    if (alias === null) return key;
    const value = {};

    value[alias] = key;
    return value;
  }

  /**
   * @param {import('../Manager/DatabaseManager')} manager 
   * @param {import('knex')}
   */
  constructor(manager, connection) {
    this.manager = manager;
    this.connection = connection;
    this._query = null;
    this._from = null;
    this.tables = [];
  }

  /**
   * @returns {import('knex').QueryBuilder}
   */
  get query() {
    return this._query;
  }

  /**
   * @returns {string}
   */
  get string() {
    return this.query.toString();
  }

  /**
   * @param {string} select 
   * 
   * @returns {this}
   */
  select(table, fields = null) {
    if (table !== this._from.alias) {
      table = this.wire(table + '.field').alias;
    }
    if (fields === null) {
      this.query.select(table + '.*');
    } else if (Array.isArray(fields) && fields.length) {
      for (const field of fields) {
        this.query.select(table + '.' + field);
      }
    } else if (typeof fields === 'object') {
      for (const field in fields) {
        this.query.select(Query.as(table + '.' + field, fields[field]));
      }
    } 
    return this;
  }

  from(name, alias = null) {
    const schema = this.manager.schema(name);

    this._from = {alias: alias || schema.table, schema};
    this._query = this.connection(Query.as(schema.table, alias));
    return this;
  }

  /**
   * @param {string} field 
   * @param {string} joinFunction
   * @returns {WireObject}
   */
  wire(field, joinFunction = 'join') {
    const split = field.split('.');
    const last = split.pop();
    let current = {
      alias: this._from.alias,
      schema: this._from.schema,
    };

    for (const item of split) {
      current = this.wireItem(current, this.manager.schema(item), joinFunction);
    }
    current.field = current.schema.prop(last) || last;
    return current;
  }

  /**
   * @param {WireObject} current 
   * @param {import('../Config/Schema')} schema
   * @param {string} joinFunction
   * @returns {WireObject}
   */
  wireItem(current, schema, joinFunction = 'join') {
    const next = {
      alias: current.alias + '__' + schema.name,
      schema: schema,
    };

    if (this.tables.indexOf(next.alias) === -1) {
      this.tables.push(next.alias);
      const join = {};
      for (const index in current.schema.wire.from) {
        if (current.schema.wire.from[index].startsWith('+')) {
          join[current.alias + '.' + index.substring(1)] = this.connection.raw('?', [current.schema.wire.from[index]]);
          continue;
        }
        if (next.schema.wire.to[index] === undefined) continue;
        join[current.alias + '.' + current.schema.wire.from[index]] = next.alias + '.' + next.schema.wire.to[index];
      }
      for (const index in next.schema.wire.to) {
        if (!index.startsWith('+')) continue;
        join[next.alias + '.' + index.substring(1)] = this.connection.raw('?', [next.schema.wire.to[index]]);
      }
      this.query[joinFunction](Query.as(next.schema.table, next.alias), join);
    }
    return next;
  }

  /**
   * @param {string} field 
   * @param {*} value 
   * @param {string} operator 
   * @returns {this}
   */
  condition(field, value, operator = QueryCondition.EQUAL) {
    const wire = this.wire(field);
    this.query.where(wire.alias + '.' + wire.field, operator, value);
    return this;
  }

  /**
   * @returns {import('./QueryCondition')}
   */
  and() {
    return new QueryCondition(this);
  }

  /**
   * @returns {import('./QueryCondition')}
   */
  or() {
    return new QueryCondition(this, 'or');
  }

  /**
   * @param {string} field 
   * @param {string} order 
   * @returns {this}
   */
  sort(field, order = 'asc') {
    const wire = this.wire(field);
    this.query.orderBy(wire.alias + '.' + wire.field, order);
    return this;
  }

}