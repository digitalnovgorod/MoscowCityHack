var dcopy = require('deep-copy');

exports.get = function (req, res, next) {
    var settings = res.locals._admin.settings,
        custom = res.locals._admin.custom;
    settings_list = dcopy(settings);

    var section_tables = {SYS_ROLE:'',SYS_DOMAIN:'',SYS_STATUS:'',SYS_TYPE:''};
    var tables_sys = [];
    for (var key in section_tables) {
        var item = settings[key];
        delete settings_list[key];
        if (!item.mainview.show || !item.table.pk || item.table.view) continue;
        // BRITIN
        var item_verbose = "";
        if (res.locals.string[item.table.verbose]) {item_verbose = res.locals.string[item.table.verbose];} else {item_verbose = item.table.verbose;}
        tables_sys.push({slug: item.slug, name: item_verbose });
    }

    var section_tables = {PROBLEM:'',SOLUTION:'',PRODUCT:'',RESOURCE:'',TERRITORY:'',AREA:'',MAP:'',LAYER:'',APPLICATION:'',FEATURE:'',SCRIPT:'',KEYFRAME:''};
    var tables_gis = [];
    for (var key in section_tables) {
        var item = settings[key];
        delete settings_list[key];
        if (!item.mainview.show || !item.table.pk || item.table.view) continue;
        // BRITIN
        var item_verbose = "";
        if (res.locals.string[item.table.verbose]) {item_verbose = res.locals.string[item.table.verbose];} else {item_verbose = item.table.verbose;}
        tables_gis.push({slug: item.slug, name: item_verbose });
    }

    var section_tables = {TEAM:'',USER:'',PARTICIPATION:'',ROLE:'',ACCESSCONTROLLIST:''};
    var tables_usr = [];
    for (var key in section_tables) {
        var item = settings[key];
        delete settings_list[key];
        if (!item.mainview.show || !item.table.pk || item.table.view) continue;
        // BRITIN
        var item_verbose = "";
        if (res.locals.string[item.table.verbose]) {item_verbose = res.locals.string[item.table.verbose];} else {item_verbose = item.table.verbose;}
        tables_usr.push({slug: item.slug, name: item_verbose });
    }

    var tables = [];
    for (var key in settings_list) {
        var item = settings[key];
        if (!item.mainview.show || !item.table.pk || item.table.view) continue;
        // BRITIN
        var item_verbose = "";
        if (res.locals.string[item.table.verbose]) {item_verbose = res.locals.string[item.table.verbose];} else {item_verbose = item.table.verbose;}
        tables.push({slug: item.slug, name: item_verbose });
    }

    var views = [];
    for (var key in settings) {
        var item = settings[key];
        if (!item.mainview.show || !item.table.view) continue;
        views.push({slug: item.slug, name: item.table.verbose});
    }

  /*  var customs = [];
    for (var key in custom) {
        var item = custom[key].app;
        if (!item || !item.mainview || !item.mainview.show) continue;
        customs.push({slug: item.slug, name: item.verbose});
    }*/

    res.locals.tables = !tables.length ? null : {items: tables};
    res.locals.tables_sys = !tables_sys.length ? null : {items: tables_sys};
    res.locals.tables_gis = !tables_gis.length ? null : {items: tables_gis};
    res.locals.tables_usr = !tables_usr.length ? null : {items: tables_usr};
    res.locals.views = !views.length ? null : {items: views};
  //  res.locals.custom = !customs.length ? null : {items: customs};

    res.locals.partials = {
        content:  'mainview'
    };

    next();
}
