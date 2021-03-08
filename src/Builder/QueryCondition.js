module.exports = class QueryCondition {

  static get EQUAL() {
    return '=';
  }

  static get NOT_EQUAL() {
    return '!=';
  }

  static get define() {
    return {
      and: {
        join: 'join',
        where: 'where',
      },
      or: {
        join: 'leftJoin',
        where: 'orWhere',
      },
    };
  }

  /**
   * @param {import('./Query')} query
   */
  constructor(query, group = 'and') {
    this.query = query;
    this.define = QueryCondition.define[group];
  }

  /**
   * @param {string} field 
   * @param {*} value 
   * @param {string} operator 
   * @returns {this}
   */
  condition(field, value, operator = QueryCondition.EQUAL) {
    const wire = this.query.wire(field, this.define.join);
    this.query.query[this.define.where](wire.alias + '.' + wire.field, operator, value);
    return this;
  }

}