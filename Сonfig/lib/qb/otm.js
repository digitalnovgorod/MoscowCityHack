
var x = null,
    z = require('./partials')();

/*
function select (args, ref) {
    var concat = z.concat(ref.columns,ref.table,undefined,' ');

    var pk = x.as(z.concat(ref.pk,ref.table,z.schema(ref),','),x.name('__pk')),
        text = x.as(concat,x.name('__text'));

    var str = [
        x.select([pk,text]),
        x.from(x.name(ref.table,z.schema(ref))),
        ';'
    ].join(' ');

    args.log && console.log('otm'.grey, str);
    return str;
}
*/

// BRITIN
function select (args, ref) {
    var concat = z.concat(ref.columns,ref.table,undefined,' ');
    // BRITIN [0] first column means
    var pk = ref.pk
        if (typeof pk != 'string') pk = [pk[0]];
        pk = x.as(z.concat(pk,ref.table,z.schema(ref),','),x.name('__pk')),
        text = x.as(concat,x.name('__text'));

    // BRITIN
        x1 = console.log.bind(console);
          x1('!!!!!!!!');
          x1(ref.pk_keyvalue);
          x1(ref.table);
          x1(ref.pk_for_list);
          x1(pk);
          x1(text);

    var x_where_clause = ""
    if (!(typeof ref.pk_for_list === 'undefined' || typeof ref.pk_keyvalue ==='undefined'))  x_where_clause = x.where(z.eq(ref.table, ref.pk_for_list, ref.pk_keyvalue));
          x1(x_where_clause);
    var str = [
        x.select([pk,text]),
        x.from(x.name(ref.table,z.schema(ref))),
        // BRITIN
        x_where_clause,
        ';'
    ].join(' ');

  /*  x1 = console.log.bind(console);
    x1('!!!!!!!!');
    x1(str);
    x1(ref);
    x1(args); */

    args.log && console.log('otm'.grey, str);
    return str;
}

exports = module.exports = function (instance) {
    if (instance) x = instance;
    return {
        select:select
    }
}
