var resource  = require('resource'),
    admin = resource.define('admin');

admin.schema.description = "web based admin panel";

resource.use('system');
resource.use('view');
resource.use('datasource');
resource.use('forms');
resource.use('http');

admin.method('listen', listen, {
  "description": "start a listening admin web server",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "port": resource.http.schema.properties['port'],
        "host": resource.http.schema.properties['host']
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

function listen (options, callback) {
  var connect = require('connect');
  var auth = connect.basicAuth('admin', 'admin');

  if(!resource.http.app) {
    resource.http.listen(options, function(){}); // TODO: figure out if ignoring this callback is a race condition or not
  }

  resource.http.app.use(connect.static(__dirname + '/public'));

  var view = resource.view.create({ path: __dirname + '/view'});
  view.load();

  //
  // TODO: cleanup route handlers / make into common methods
  //

  resource.http.app.get('/admin', auth, function (req, res, next) {
    var _r = _resources();
    view.index.render({
      system: JSON.stringify(dashboard(), true, 2)
    });
    str = view.index.present({ resources: resource.resources });
    res.end(str);
  });

  resource.http.app.get('/admin/resources', auth, function (req, res, next) {
    var str = view.resources.render();
    str = view.resources.present({ resources: resource.resources });
    res.end(str);
  });

  resource.http.app.get('/admin/ssh', auth, function (req, res, next) {
   view.ssh.render({});
   str = view.ssh.present({});
   res.end(str);
  });

  resource.http.app.get('/admin/mesh', auth, function (req, res, next) {
   view.mesh.render({});
   view.mesh.present({}, function(err, str){
     res.end(str);
   });
  });

  resource.http.app.get('/admin/docs', auth, function (req, res, next) {
   view.docs.render({});
   str = view.docs.present({});
   res.end(str);
  });

  /*
  resource.http.app.get('/admin/docs/resources/:resource', function (req, res, next) {
    var r = resource.resources[req.param('resource')];
    var str = resource.docs.generate(r);
    var view = resource.view.create({
      template: str,
      input: "markdown"
    });
    str = '<link href="/style.css" rel="stylesheet"/> \n' + view.render();
    res.end(str);
  });
  */

  resource.http.app.get('/admin/replicator', auth, function (req, res, next) {
   view.replicator.render({});
   str = view.replicator.present({});
   res.end(str);
  });

  resource.http.app.get('/admin/datasources', auth, function (req, res, next) {
   view.datasources.render({});
   resource.datasource.all(function(err, results){
     str = view.datasources.present({ datasources: results });
     res.end(str);
   });
  });

  resource.http.app.get('/admin/datasources/:datasource', auth, function (req, res, next) {
   resource.datasource.get(req.param('datasource'), function(err, result){
     view.datasource.render({});
     str = view.datasource.present({ datasource: result });
     res.end(str);
   });
  });

  resource.http.app.get('/admin/resources/:resource', auth, function (req, res, next) {
    var _resource = resource.resources[req.param('resource')],
        obj = resource.toJSON(_resource),
        str;

    str = view.resource.render({
      name: _resource.name,
      methods: JSON.stringify(_methods(_resource), true, 2)
    });

    str = view.resource.present({
      methods: _resource.methods,
      resource: _resource
    });
    res.end(str);

  });

  resource.http.app.post('/admin/resources/:resource/:method', auth, function (req, res, next) {

    var _resource = resource.resources[req.param('resource')],
        _method = _resource[req.param('method')],
        id = req.param('id'),
        str,
        data = {},
        props = _method.schema.properties || {};

    //
    // Pull out all the params from the request based on schema
    //
    if(typeof _method.schema === 'undefined') {
      _method.schema = {
        properties: {}
      };
    }

    if(_method.schema.properties && typeof _method.schema.properties.options !== 'undefined') {
      props = _method.schema.properties.options.properties;
    }

    Object.keys(props).forEach(function(prop) {
      data[prop] = req.param(prop);
      if(props[prop].type === "number") {
        data[prop] = Number(req.param(prop));
      }
    });

    str = view.method.render({
      label: req.param('resource') + ' - ' + req.param('method'),
      method: _method.unwrapped.toString(),
      schema: JSON.stringify(_method.schema, true, 2)
    });

    str = view.method.present({
      resource: _resource,
      methods: _resource.methods,
      method: _method, name:
      req.param('method'),
      data: data,
      id: id
    }, function(err, str){
      res.end(str);
    });

  });

  resource.http.app.get('/admin/resources/:resource/:method', auth, function (req, res, next) {
    var _resource = resource.resources[req.param('resource')],
        _method = _resource[req.param('method')],
        str;
    str = view.method.render({
      label: req.param('resource') + ' - ' + req.param('method'),
      method: _method.unwrapped.toString(),
      schema: JSON.stringify(_method.schema, true, 2)
    });
    str = view.method.present({ resource: _resource, methods: _resource.methods, method: _method, name: req.param('method') }, function(err, str){
      res.end(str);
    });
  });

  resource.http.app.post('/admin/resources/:resource/:method/:id', auth, function (req, res, next) {
    var _resource = resource.resources[req.param('resource')],
        _id = req.param('id'),
        _method = _resource[req.param('method')];


    //
    // Pull out all the params from the request based on schema
    //
    if(typeof _method.schema === 'undefined') {
      _method.schema = {
        properties: {}
      };
    }

    var props, str, data = {};

    props = _method.schema.properties;

    if(typeof _method.schema.properties.options !== 'undefined') {
      props = _method.schema.properties.options.properties;
    }

    Object.keys(props).forEach(function(prop) {
      data[prop] = req.param(prop);
      if(props[prop].type === "number") {
        data[prop] = Number(req.param(prop));
      }
    });

    view.method.render({
      label: req.param('resource') + ' - ' + req.param('method'),
      method: _method.unwrapped.toString(),
      schema: JSON.stringify(_method.schema, true, 2)
    });

    view.method.present({
      resource: _resource,
      methods: _resource.methods,
      method: _method,
      name: req.param('method'),
      id: _id,
      data: data,
      action: 'post'
    }, function(err, str){
      res.end(str);
    });

  });

  resource.http.app.get('/admin/resources/:resource/:method/:id', auth, function (req, res, next) {
    var _resource = resource.resources[req.param('resource')],
        _id = req.param('id'),
        _method = _resource[req.param('method')],
        str;
    str = view.method.render({
      label: req.param('resource') + ' - ' + req.param('method'),
      method: _method.unwrapped.toString(),
      schema: JSON.stringify(_method.schema, true, 2)
    });
    str = view.method.present({
      resource: _resource,
      methods: _resource.methods,
      method: _method,
      name: req.param('method'),
      id: _id
    }, function(err, str){
      res.end(str);
    });
  });

  callback(null, resource.http.server);
}

exports.admin = admin;

exports.dependencies = {
  "connect": "*"
};

//
// TODO: move this out of here to resource.toJSON
//
  function _resources () {
    var arr = [];
    Object.keys(resource.resources).forEach(function(r){
      arr.push(r);
    });
    return arr;
  }
  function _methods (resource) {
    var arr = [];
    Object.keys(resource.methods).forEach(function(m){
      arr.push(m);
    });
    return arr;
  }
//
//
//


// generates JSON-data to be sent to dashboard view
function dashboard () {

  var os  = require('os'),
      obj = {};

  obj.version  = "v0.0.0";

  obj.system = resource.system.info();

  obj.resources = [];

  for(var r in resource.resources) {
    obj.resources.push(r);
  }

  return obj;

};