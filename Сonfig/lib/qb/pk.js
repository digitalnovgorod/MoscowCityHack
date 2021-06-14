// BRITIN
var x = null,
    z = require('./partials')();


function select (args, ref) {
      var pk = "";
      var id = "";
      var view = args.config,
          table = view.table,
          columns = view.columns;
      var names = [],
          joins = [];
    // BRITIN
        x1 = console.log.bind(console);
    for (var i=0; i < columns.length; i++) {
                names.push(x.name(columns[i].name,table.name,z.schema(table)));
        }

    var x_where_clause = ""
    if (!(typeof ref.pk === 'undefined') && !(typeof ref.id === 'undefined')) {
          if (typeof pk != 'string') {pk = [pk[0]]} else {pk = ref.pk;}
          if (typeof id != 'string') {id = [id[0]]} else {id = ref.id;}
          x_where_clause = x.where(z.eq(ref.table, pk, id));
    }

          x1(x_where_clause);
    var str = [
        x.select([pk,'*']),
        x.from(x.name(ref.table,z.schema(ref))),
        // BRITIN
        x_where_clause,
        ';'
    ].join(' ');

    var from = args.page ? (args.page-1)*view.listview.page : 0;

    args.statements = {
             columns: names.join(), table: x.name(table.name,z.schema(table)),
             join: '',
             where: x_where_clause, group: '', order: '1',
             from: from , to: view.listview.page
         }

    args.log && console.log('pk'.grey, str);
    x1(view.listview.page);
    return str;
}

exports = module.exports = function (instance) {
    if (instance) x = instance;
    return {
        select:select
    }
}
