
var express = require('express');
var app = module.exports = express();
var path = require('path');

var async = require('async'),
    dcopy = require('deep-copy');
var qb = require('../../../lib/qb')(),
    data = require('../../../lib/data')
var filter = require('../../../lib/listview/filter');

const jsonParser = express.json();

function getArgs (req, res) {
    var args = {
        settings : res.locals._admin.settings,
        db       : res.locals._admin.db,
        debug    : res.locals._admin.debug,
        log      : res.locals._admin.log,
        slug     : 'V_WIDGET',
        pk       : 'ELEMENT_GUID',
        page     : 0,
        data     : req.body
    };
    args.name = res.locals._admin.slugs[args.slug];
    args.config = dcopy(args.settings[args.name]);

    return args;
}

app.set('views', __dirname);

app.get('/widgetbar', jsonParser, function (req, res, next) {
  //x = console.log.bind(console);
  //x('DO GET');
  //x(req);
  //x(res);

    _data(req, res, next);
    //x('DONE GET');
});

app.post('/view/widgetbar', jsonParser, function (req, res, next) {
  //x = console.log.bind(console);
  //x('DO GET');
  //x(req);
  //x(res);

    //next();
    //_data(req, res, next);
    //x('DONE GET');
});

// app.get = function (req, res, next) {
//    _data(req, res, next);
//}

function _data (req, res, next) {
    var args = getArgs(req, res),
        events = res.locals._admin.events;

    args.filter = filter.prepareSession(req, args);
    req.pk = args.pk;
    req.id = req.query['id']; // ETL-DTS-23CF112B3B851150988EDE5140D75C34'
    req.table = args.slug
    qb.pk.select(args,req);
    x = console.log.bind(console);
    x1(req);
    var results = {};
    async.series([
        events.preList.bind(events, req, res, args),
        function (done) {
          // BRITIN res!!!
            data.list.get(res,args, function (err, result) {
                if (err) return done(err);
                results.data = result;
                //x('DO SELECT');
                //x(result.columns);
                //x(result.records[0].pk);
                //x(result.records[0].values);
                done();
            });
        }
    ], function (err) {
        if (err) return next(err);
        render(
            req, res, args,
            results.data, results.pager, results.order,
            next
        );
    });
}

function render (req, res, args, ddata, pager, order, next) {
  x('DO RENDER');

  //var string = res.locals.string;
  //var view = args.settings[args.name];

  //BRITIN
  //    if (res.locals.string[view.table.verbose]) {
  //        view.table.verbose = res.locals.string[view.table.verbose] }
  //

  /*res.locals.view = {
      name: args.config.table.verbose,
      slug: args.slug,
      error: res.locals.error,
      table: !args.config.table.view
  };*/

  /*res.locals.breadcrumbs = {
      links: [
          {url: '/', text: res.locals.string.home},
          {active: true, text: args.config.table.verbose}
      ]
  };*/

    res.locals.show.error = args.error;
    //res.json(json)
    res.locals.columns = ddata.columns;
    res.locals.records = ddata.records;
    for (var i=0;i<ddata.records.length;i++) {
        res.locals.records[i].id = '{{'+ddata.records[i].values[2]+'}}';
        res.locals.records[i].link = '/DATASET/'+ddata.records[i].values[2];
        res.locals.records[i].pre = ddata.records[i].values[1].split('/')[0];
        res.locals.records[i].name = ddata.records[i].values[1].split('/')[1];
        if (res.locals.records[i].pre == ' ') {
          res.locals.records[i].class = "list-group-item-dnd";}
        else {
          res.locals.records[i].class = "list-group-item-dnd dnd-red"}
        if (ddata.records[i].values[5] == 'LOADED') {
          res.locals.records[i].class = "list-group-item-dnd dnd-green";}
    }
    //res.locals.pagination = pager;

    var relative = path.relative(res.locals._admin.views, app.get('views'));


    x(relative);
    //x(result.records[0].pk);
    //x(result.records[0].values);

    res.locals.partials = {
        //content: path.join(relative, 'elements')
        //content:    'listview',
        //column:     'listview/column',
        content: '../config/custom/widgetbar/elements'
    };
    x(res.locals.columns);
    x('RENDER DONE');
    x(res.locals.records);
    next();
}
