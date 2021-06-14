
var slugify = require('slugify');


/**
 * Insert new tables and columns for a settings object.
 *
 * @param {Object} settings
 * @param {Object} info
 * @param {Function} callback
 * @api public
 */

exports.refresh = function (settings, info) {
    for (var table in info) {
        var view  = info[table].__view;
        delete info[table].__view;

        var columns = info[table],
            pk = primaryKey(columns);

        if (settings[table] === undefined) {
            settings[table] = createTable(table, pk, view);
        }

        for (var name in columns) {
            if (exists(settings[table].columns, name)) continue;

            settings[table].columns.push(createColumn(table, name, columns[name]));
        }
    }
    return settings;
}

/**
 * Check for column existence.
 *
 * @param {Array} columns
 * @param {String} name
 * @api private
 */

function exists (columns, name) {
    for (var i=0; i < columns.length; i++) {
        if (columns[i].name == name) return true;
    }
    return false;
}

/**
 * Create settings object for a table.
 *
 * @param {String} name
 * @param {String} pk
 * @api private
 */

function createTable (name, pk, view) {
    return {
        slug: slugify(name),
        table: {
            name: name,
            pk: pk,
            verbose: name,
            view: view
        },
        columns: [],
        mainview: {
            show: true
        },
        listview: {
            order: {},
            page: 25
        },
        editview: {
            readonly: false
        }
    };
}

/**
 * Create a settings object for a column.
 *
 * @param {String} name
 * @param {Object} info
 * @param {Number} idx
 * @api private
 */

function createColumn (table, name, info) {
      var DOMAIN = '';
      switch (true) {
        case (table=='RESOURCE'): DOMAIN = 'GIS-RES';break;
        case (table=='DATASOURCE'): DOMAIN = 'ETL-DWH';break;
        case (table=='WIDGET'): DOMAIN = 'ACT-WGT';break;
        case (table=='SCRIPT'): DOMAIN = 'ACT-SCP';break;
        case (table=='PROCESS'): DOMAIN = 'BPM-PRC';break;
        case (table=='WORKFLOW'): DOMAIN = 'ETL-WTF';break;
        case (table=='JOB'): DOMAIN = 'ETL-JOB';break;
        case (table=='CASE'): DOMAIN = 'PRJ-CAS';break;
        case (table=='SOLUTION'): DOMAIN = 'PRJ-SOL';break;
        case (table=='ROLE'): DOMAIN = 'USR-ROL';break;
        case (table=='PRODUCT'): DOMAIN = 'PRC-PRD';break;
        case (table=='RESULT'): DOMAIN = 'ACT-RLT';break;
        case (table=='SYS_TEMPLATE'): DOMAIN = 'TPL-DWH';break;
        case (table=='ELEMENT'): DOMAIN = 'BPM-ELM';break;
        case (table=='DATASET'): DOMAIN = 'ETL-DTS';break;
      }
      //BRITIN AFTER table,switch
      switch (true) {
        case (name == 'GUID'):
            return {name: name,
            verbose: name,
            control: {text: true},
            type: info.type,
            allowNull: true,
            defaultValue: null,
            listview: {show: true},
            editview: {show: false}}
        case (name == 'DATASOURCE_CONFIGURATION'):
                return {name: name,
                verbose: name,
                control: {jsonwidget: true},
                type: info.type,
                allowNull: true,
                defaultValue: null,
                listview: {show: false},
                editview: {show: true}}
        case (name == 'DATASETAREA'):
                return {name: name,
                verbose: name,
                control: {jsonwidget: true},
                type: info.type,
                allowNull: true,
                defaultValue: null,
                listview: {show: false},
                editview: {show: true}}
        case (name == 'PROCESSAREA'):
                return {name: name,
                verbose: name,
                control: {textarea: true,
                  editor: "bpmn-compact"},
                type: info.type,
                allowNull: true,
                listview: {show: true},
                editview: {show: true}}
        case (name == 'TEXTAREA'):
                return {name: name,
                verbose: name,
                control: {textarea: true,
                  editor: "ck-compact"},
                type: info.type,
                allowNull: true,
                listview: {show: true},
                editview: {show: true}}
        case (name == 'DOMAIN'):
            return {name: name,
            verbose: name,
            control: {text: true},
            type: info.type,
            allowNull: true,
            listview: { show: false },
            editview: { show: false }}
        case (name.includes('PREV_GUID')||name.includes('NEXT_GUID')||name.includes('ANCESTOR_GUID')||name.includes('DESCENDANT_GUID')):
                return {name: name,
                verbose: name,
                control: {select: true, multiple: false},
                oneToMany: {table: table, pk:'GUID', columns: [table.concat("_NAME")]},
                type: info.type,
                allowNull: info.allowNull,
                defaultValue: null,
                listview: {show: true},
                editview: {show: true}}
        case (name.includes('_GUID')):
            return {name: name,
            verbose: name,
            control: {select: true, multiple: false},
            oneToMany: {table: name.replace("_GUID",""), pk:'GUID', columns: [name.replace("_GUID","_NAME")]},
            type: info.type,
            allowNull: info.allowNull,
            defaultValue: null,
            listview: {show: true},
            editview: {show: true}}
        case (name == 'TYPE'):
                return {name: name,
                verbose: name,
                control: {select: true, multiple: false},
                oneToMany: {table: 'SYS_TYPE', fk:['TYPE'], pk:['TYPE'],pk_for_list:['DOMAIN_NAME'],pk_keyvalue:[DOMAIN], columns: ['TYPE','DESCRIPTION']},
                type: info.type,
                allowNull: info.allowNull,
                defaultValue: null,
                listview: {show: true},
                editview: {show: true}}
        case (name == 'STATUS'):
                return {name: name,
                verbose: name,
                control: {select: true, multiple: false},
                oneToMany: {table: 'SYS_STATUS', fk:['STATUS'], pk:['STATUS'], pk_for_list:['DOMAIN_NAME'],pk_keyvalue:[DOMAIN], columns: ['STATUS','DESCRIPTION']},
                type: info.type,
                allowNull: info.allowNull,
                defaultValue: null,
                listview: {show: true},
                editview: {show: true}}
        default:
            // BEFORE
            return {name: name,
            verbose: name,
            control: {text: true},
            type: info.type,
            allowNull: info.allowNull,
            defaultValue: info.defaultValue,
            listview: {show: true},
            editview: {show: true}}
      }
}

/**
 * Get the first found primary key from a given table's columns list.
 *
 * @param {Object} columns
 * @api private
 */

function primaryKey (columns) {
    var pk = [];
    for (var name in columns) {
        for (var property in columns[name]) {
            if (columns[name][property] === 'pri') {
                pk.push(name);
            }
        }
    }
    return !pk.length ? '' : (pk.length > 1 ? pk : pk[0]);
}
