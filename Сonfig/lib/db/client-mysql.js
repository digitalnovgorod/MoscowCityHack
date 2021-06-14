
/**
 * MySql: https://dev.mysql.com/doc/dev/connector-nodejs/8.0/tutorial-Connecting_to_a_Server.html
  * MySql: https://github.com/vpkreddi/xdevapiTest/blob/master/db/connection.js
 */

function MySql () {
    this.client = require('@mysql/xdevapi');
    this.connection = null;
    this.config = require('./db_config');

    this.mysql = true;
    this.name = 'mysql';
}

MySql.prototype.connect = function (options, done) {
      this.connection = this.client.getClient(this.config, {
           pooling:
           {
               enabled: false,
               maxSize: 3
           }
       });
      this.connection.getSession().then(session => {
          console.log(session.inspect()); // { pooling: true, ... }
          done();
      });
}

MySql.prototype.handleDisconnect = function (options) {
    setTimeout(function () {
        this.connect(options, function (err) {
            err && this.handleDisconnect(options);
        }.bind(this));
    }.bind(this), 2000);
}

MySql.prototype.query = function (sql, done) {
    this.connection.query(sql, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

MySql.prototype.getColumnsInfo = function (data) {
    var columns = {};
    for (var key in data) {
        var column = data[key];
        columns[column.Field] = {
            type: column.Type,
            allowNull: column.Null === 'YES' ? true : false,
            key: column.Key.toLowerCase(),
            defaultValue: column.Default
            // extra: column.Extra
        };
    }
    return columns;
}


/**
 * PostgreSql: https://github.com/brianc/node-postgres
 * or: https://github.com/brianc/node-postgres-pure
 */

function PostgreSQL () {
    try {this.client = require('pg')}
    catch (err) {
        try {this.client = require('pg.js')}
        catch (err) {
            throw Error('Could not find `pg` or `pg.js` module');
        }
    }
    this.connection = null;
    this.config = null;

    this.pg = true;
    this.name = 'pg';
}

PostgreSQL.prototype.connect = function (options, done) {
    this.connection = new this.client.Client(options);
    this.connection.connect(function (err) {
        if (err) return done(err);
        this.config = this.connection.connectionParameters;
        this.config.schema = options.schema || 'public';
        done();
    }.bind(this));
}

PostgreSQL.prototype.query = function (sql, done) {
    this.connection.query(sql, function (err, result) {
        if (err) return done(err);
        if (result.command == 'INSERT' && result.rows.length) {
            var obj = result.rows[0],
                key = Object.keys(obj)[0];
            result.insertId = obj[key];
            return done(null, result);
        }
        // select
        done(null, result.rows);
    });
}

function getType (column) {
    switch (true) {
        case /^double precision$/.test(column.Type):
            return 'double';

        case /^numeric$/.test(column.Type):
            return column.numeric_precision
                ? 'decimal('+column.numeric_precision+','+column.numeric_scale+')'
                : 'decimal'

        case /^time\s.*/.test(column.Type):
            return 'time';
        case /^timestamp\s.*/.test(column.Type):
            return 'timestamp';

        case /^bit$/.test(column.Type):
            return 'bit('+column.character_maximum_length+')';
        case /^character$/.test(column.Type):
            return 'char('+column.character_maximum_length+')';
        case /^character varying$/.test(column.Type):
            return 'varchar('+column.character_maximum_length+')';

        case /^boolean$/.test(column.Type):
            return 'char';

        default: return column.Type;
    }
}
PostgreSQL.prototype.getColumnsInfo = function (data) {
    var columns = {};
    for (var key in data) {
        var column = data[key];
        columns[column.Field] = {
            type: getType(column),
            allowNull: column.Null === 'YES' ? true : false,
            key: (column.Key && column.Key.slice(0,3).toLowerCase()) || '',
            defaultValue: column.Default && column.Default.indexOf('nextval')==0 ? null : column.Default
            // extra: column.Extra
        };
    }
    return columns;
}


/**
 * Sqlite: https://github.com/mapbox/node-sqlite3
 */

function SQLite () {
    try {
        this.client = require('sqlite3');
    } catch (err) {
        throw new Error('Could not find `sqlite3` module');
    }
    this.connection = null;
    this.config = null;

    this.sqlite = true;
    this.name = 'sqlite';
}

SQLite.prototype.connect = function (options, done) {
    this.connection = new this.client.Database(options.database);
    this.config = {schema:''};
    done();
}

SQLite.prototype.query = function (sql, done) {
    if (/^(insert|update|delete)/i.test(sql)) {
        this.connection.run(sql, function (err) {
            if (err) return done(err);
            done(null, {insertId: this.lastID});
        });
    } else {
        this.connection.all(sql, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        });
    }
}

SQLite.prototype.getColumnsInfo = function (data) {
    var columns = {};
    for (var i=0; i < data.length; i++) {
        var column = data[i];
        columns[column.name] = {
            type: column.type,
            allowNull: column.notnull === 1 ? false : true,
            key: column.pk === 1 ? 'pri' : '',
            defaultValue: column.dflt_value
        };
    }
    return columns;
}


/**
 * Factory
 */

function Client (config) {
    if (config.mysql)
        return new MySql();

    if (config.pg)
        return new PostgreSQL();

    if (config.sqlite)
        return new SQLite();

    else throw new Error('Not supported database type!');
}


exports = module.exports = Client;
