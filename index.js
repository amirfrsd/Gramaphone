
//Packages and Dependencies
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.port || 8080;
var router = express.Router();
var http = require('http');

//App Settings
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api', router);
var vkCrawler = "http://www.vkdownload.net/musique/"

//Middleware
router.use(function(req,res,next){
    console.log("middleware is working");
    next();
});

//Functions
function collectLinks(string) {
    var re = /(.*data-key="\s+)(.*)(\s+<td class="controleTable">.*)/;
    var jadid = string.replace(re,"$2");
    return jadid;
}
var charMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=';
var decode = function(e){
    if (!e || e.length % 4 == 1) return !1;
    for (var t, i, a = 0, o = 0, r = ''; i = e.charAt(o++);null )
        i = charMap.indexOf(i),
        ~i && (t = a % 4 ? 64 * t + i : i, a++ % 4) && ( r += String.fromCharCode(255 & t >> ( - 2 * a & 6)) );
    return r
};
var decode2 = {
    v: function(e) {
        return e.split('').reverse().join('')
    },
    r: function(e, t) {
        e = e.split('');
        for (var i, a = charMap + charMap, o = e.length; o--;null) i = a.indexOf(e[o]), ~i && (e[o] = a.substr(i - t, 1));
        return e.join('')
    },
    x: function(e, t) {
        var n = [];
        return t = t.charCodeAt(0),
            e.split(''), function(e, i) {
                n.push(String.fromCharCode(i.charCodeAt(0) ^ t))
            },
            n.join('')
    }
};

var decodeSecret = function(secret){

    var t = secret.split('#'),
        n = decode(t[1]),
        t = decode(t[0]);

    n = n.split(String.fromCharCode(9));
    for (var a, r, s = n.length; s--; null ) {
        r = n[s].split(String.fromCharCode(11))
        a = r.splice(0, 1, t) [0]
        t = decode2[a].apply(null, r)
    }

    return getProxy(t);
}

var getProxy = function(url){
    url = url.split(/\/\/([^\.]+?)\.(vk.me|vk-cdn.net)\/(.*?)\.mp3/);

    return {
        'stream' : 'http://www.vkdownload.net/stream/'+url[1]+'/'+url[3]+'.mp3',
        'download' : 'http://www.vkdownload.net/download/'+url[1]+'/'+url[3]+'.mp3'
    }
};

//Routers
router.post('/vk',function(req,response){
    var songName = req.body.song
    var encode = encodeURI(songName);
    var crawlThisSite = vkCrawler + encode;
    request(crawlThisSite, function(err,res,body){
        if (err) {
            console.log("err" + err); res.json({success:false, message:err});
        } else {
            if (res.statusCode === 200) {
                (function(callback) {
                    'use strict';
                    const httpTransport = require('http');
                    const responseEncoding = 'utf8';
                    const httpOptions = {
                        hostname: 'www.vkdownload.net',
                        port: '80',
                        path: '/vk.php?query=justin%20bieber',
                        method: 'POST',
                        headers: {"Cookie":"__cfduid=d6311a20501e7957b6573563fdc1595f51488760625; PHPSESSID=a15fb974f379702c209720f14b3b8e30","Content-Type":"application/x-www-form-urlencoded; charset=utf-8"}
                    };
                    httpOptions.headers['User-Agent'] = 'node ' + process.version;
                    const request = httpTransport.request(httpOptions, (res) => {
                        let responseBufs = [];
                        let responseStr = '';
                        res.on('data', (chunk) => {
                            if (Buffer.isBuffer(chunk)) {
                                responseBufs.push(chunk);
                            }
                            else {
                                responseStr = responseStr + chunk;            
                            }
                        }).on('end', () => {
                            responseStr = responseBufs.length > 0 ? 
                                Buffer.concat(responseBufs).toString(responseEncoding) : responseStr; 
                            callback(null, res.statusCode, res.headers, responseStr);
                        });
                    })
                    .setTimeout(0)
                    .on('error', (error) => {
                        callback(error);
                    });
                    request.write("query=" + songName)
                    request.end();
                })((error, statusCode, headers, body) => {
                    var $ = cheerio.load(body);
                    response.send(body);
                    var res = $('td.controleTable').each(function(i,element){
                        var simple = $(this).parent().parent().html();
                        var $2 = cheerio.load(simple);
                        var resTwo = $2('tr').each(function(i,element){
                            var q = $2(this).attr('data-key');
                            var dic = decodeSecret(q);
                            var download = dic.download;
                            var stream = dic.stream;
                            var jsonDic = stream.replace('.mp3','.json');
                            var url = jsonDic;
                            console.log('       ');
                            console.log(dic.download);
                            console.log('       ');
                            console.log(q);
                        });
                        getJSON(url).then(function(data) {
                            console.log('Your Json result is:  ' + data.title);
                        }, function(status) {
                        console.log('ridi')
                        });
                    });
                });
            }
        }
    });
});

//Default Router
router.get('/', function (req, res) {
    res.send("don't try bro:)");
});

//Server Start:)
app.listen(port);
console.log('Server Started Successfully :)');

