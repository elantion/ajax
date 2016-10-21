'use strict';
var typeOf = require('handy-type-of');
var isEmptyObject = require('handy-is-empty-object');
module.exports = {
    request: function(option){
        var req = new XMLHttpRequest();
        //request method
        if(!option.method){
            console.error('Sorry, request failed. Please fill request method argument.');
            option.resolve(false);
            return;
        }
        if(option.enctype){
            option.enctype = option.enctype.toUpperCase();
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
                        var val = option.data[key];
                        if(val === null || val === undefined){
                            val = '';
                        }
                        query.push(key + '=' + encodeURIComponent(val));
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
        if(option.method === 'POST'){
            option.enctype = option.enctype || 'JSON';
            var sendData;
            if(option.enctype === 'FORMDATA'){
                sendData = new FormData();
                for(let key in option.data){
                    if(option.data.hasOwnProperty(key)){
                        sendData.append(key, option.data[key]);
                    }
                }
            }
            if(option.enctype === 'JSON'){
                sendData = JSON.stringify(option.data);
            }
        }
        req.open(option.method, option.url);

        req.addEventListener('load', function () {
            var res;
            var contentType = req.getResponseHeader('Content-Type');
            if(/application\/json|text\/json/.test(contentType)){
                res = JSON.parse(req.responseText);
                option.resolve(res);
                return;
            }
            res = req.responseText;
            option.resolve(res);
        });
        //set headers must be after xhr.open and before xhr.send
        for(let key in option.headers){
            if(option.headers.hasOwnProperty(key)){
                req.setRequestHeader(key, option.headers[key]);
            }
        }
        if(option.enctype === 'JSON'){
            req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        }
        if(option.method === 'POST'){
            req.send(sendData);
        }
        if(option.method === 'GET'){
            req.send();
        }
    },
    get: function(url, data, headers){
        var self = this;
        return new Promise(function (resolve) {
            self.request({
                method: 'GET',
                url: url,
                data: data,
                headers: headers,
                resolve: resolve
            });
        })
    },
    post: function (url, data, headers, enctype) {
        var self = this;
        return new Promise(function (resolve) {
            self.request({
                method: 'POST',
                url: url,
                data: data,
                headers: headers,
                enctype: enctype,
                resolve: resolve
            });
        });
    }
};