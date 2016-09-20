var typeOf = require('type-of');
var isEmptyObject = require('is-empty-object');

module.exports = {
    request: function(option){
        var self = this;
        var req = new XMLHttpRequest();
        //request method
        if(!option.method){
            console.error('Sorry, request failed. Please fill request method argument.');
            option.resolve(false);
            return;
        }
        option.method = option.method.toUpperCase();
        //request url
        if(option.method === 'GET'){
            //check request enctype
            if(option.enctype){
                console.error('Request failed. Please do not set enctype argument when you use GET method.');
                option.resolve(false);
                return;
            }
            //fill request data
            if(option.data && !isEmptyObject(option.data)){
                if(typeOf(option.data) !== 'object'){
                    console.error('Request failed. Data argument must be an object.');
                    option.resolve(false);
                    return;
                }
                var query = [];
                for(let key in option.data){
                    if(option.data.hasOwnProperty(key)){
                        query.push(key + '=' + encodeURIComponent(option.data[key]));
                    }
                }
                query = query.join('&');
                if(/\?$/.test(option.url)){
                    console.error('Request failed. Please do not put "?" at the end of the url.');
                    option.resolve(false);
                    return;
                }
                if(/\?[^?]$/.test(option.url)){
                    option.url += ('&' + query);
                }else{
                    option.url += ('?' + query);
                }
            }
        }
        req.open(option.method, option.url);
        req.addEventListener('load', function () {
            var res;
            var contentType = req.getResponseHeader('Content-Type');
            if(/application\/json/.test(contentType)){
                res = JSON.parse(req.responseText);
                option.resolve(res);
                return;
            }
            res = req.responseText;
            option.resolve(res);
        });
        req.send();
    },
    get: function(url, data){
        var self = this;
        return new Promise(function (resolve) {
            self.request({
                method: 'GET',
                url: url,
                data: data,
                resolve: resolve
            });
        })
    }
};