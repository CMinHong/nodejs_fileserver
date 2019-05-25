var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var head = '<head><link rel="icon" href="data:;base64,="><head/>';

app.use('/public', express.static('public'));
app.use('file', express.static('file'));

app.get('/', function (req, res) {
    res.end(head + '<a href = "/file">files</a>');
});

app.get('*', function (req, res) {
    res.writeHead(500, {'Content-Type' : 'text/html;charset=zh-CN'});
    req.path = path.normalize(req.path + '/');
    console.log(" reach " + req.path);
    var file_path = __dirname + req.path;
    var str = '';
    str += head;
    str += '<a href="' + req.path + '">.    </a><br/>';
    str += '<a href="' + path.dirname(req.path) + '">..     </a><br/>';

    if (fs.exists(file_path, function(exists){
        if (exists) {
            fs.stat(file_path, function(err, stats){
                if (err){
                    res.writeHead(500, {'Content-Type' : 'text/html;charset=utf8'});
                    res.end('<div styel="color:black;font-size:22px;">server error</div>');
                }else{
                    if (stats.isFile()){
                        // 什么都不做，直接访问走了
                        console.log("here");
                    }else{
                        fs.readdir(file_path, function(err, files){
                            for (var i in files){
                                str += '<a href = "' + req.path + files[i] + '">' + files[i] + '</a> <br/>';
                            }
                            res.end(str);
                        });
                    }
                }
            });
        }else{
            res.end('404 Not found!!');
        }
    }));
})

var server = app.listen(3037, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址 http://%s:%s", host, port)
})
