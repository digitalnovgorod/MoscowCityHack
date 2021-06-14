
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
        slug     : 'WIDGET',
        pk       : 'GUID',
        page     : 0,
        data     : req.body
    };
    args.name = res.locals._admin.slugs[args.slug];
    args.config = dcopy(args.settings[args.name]);

    return args;
}

app.set('views', __dirname);

app.get('/view/widget', jsonParser, function (req, res, next) {
  //x = console.log.bind(console);
  //x('DO GET');
  //x(req);
  //x(res);

    _data(req, res, next);
    //x('DONE GET');
});

app.post('/view/widget', jsonParser, function (req, res, next) {
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
    req.id = req.query['id']; //ACT-WGT-FB932E0DBE46925C06BE29516D66AAD7
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

    var json = [];
    for (var i=0;i<ddata.records.length;i++) {
      var row = [];
      var obj = {};
      //obj[ddata.columns[0].name] = ddata.records[i].pk.text;
      //row.push(obj);
      for (var j=0;j<ddata.columns.length;j++) {
        var obj1 = {};
        obj1[ddata.columns[j].name] = ddata.records[i].values[j];
        row.push(obj1);
      }
      json.push(row);
    }

    res.json(json)

}
