//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs =require('fs');
var homeURL;

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/upload', function(req,res){
  res.sendfile(path.join(__dirname, 'client/upload.html'));
});

app.post('/upload', function(req, res){
  //crete an incoming form object
  var form = new formidable.IncomingForm();
  
  form.multiples = false;
  
  form.uploadDir = path.join(__dirname, '/client/img/uploads');
  
  form.on('file', function(filed, file){
    var filetype = file.name
    var length = filetype.length
    console.log(filetype +" "+ length);
    filetype= filetype.slice(length-4,length);
    
    if( filetype == ".jpg"||filetype == ".png"||filetype == ".gif"){
      fs.rename(file.path, path.join(form.uploadDir, 'backg'+filetype));
    }else{
      console.log("Invalid FileType "+filetype)
    }
        
  });
  form.on('error', function(err){
    console.log('An error has occured: \n' + err);
  });
  
  form.on('end', function(){
    res.end('success');
  });
  
  form.parse(req);
});

/*setInterval(function() {
    http.get(homeURL);
}, 300000); // every 5 minutes (300000)*/

var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
