var resource = require('resource');

var mesh = resource.use('mesh');

mesh.listen(function(){

  mesh.onAny(function(data){
    mesh.emit('server-echo-' + this.event, data);
  });

  setInterval(function(){
    mesh.emit('server-foo', { bar: "foo" });
  }, 2000);

  mesh.onAny(function(data){
    console.log(this.event, data)
  })

});
