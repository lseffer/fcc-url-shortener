var express = require("express");
var app = express();

var urldict = {};

function isURL(str) {
     var url = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
     return str.length < 2083 && url.test(str);
}

app.get('/new/*', function(req, res){
    var baseUrl = 'https://' + req.headers.host;
    var inputurl = req.params[0];
    console.log('User input '+inputurl+' valid: '+isURL(inputurl));
    if(isURL(inputurl)){
        var shortened = (Math.floor(Math.random() * (9999 - 1 + 1)) + 1).toString(10);
        urldict[shortened] = inputurl;
        res.end(JSON.stringify({"original_url":baseUrl+req.url,"shortened_url": baseUrl+'/'+shortened}));    
    } else {
        res.end(JSON.stringify({"Error":"Your input "+inputurl+" was not a valid URL."}));
    }
    
});

app.get('/:url', function(req, res){
    if(req.params.url in urldict){
        console.log('redirecting user to: '+ urldict[req.params.url]);    
        res.redirect(urldict[req.params.url]);
    }
});

app.listen(8080);
