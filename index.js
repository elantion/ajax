"use strict";
var Ajax = /** @class */ (function () {
    function Ajax() {
        //god know what I written.
    }
    Ajax.request = function (args) {
        return new Promise(function (resolve, reject) {
            if (args.enctype) {
                args.enctype = args.enctype.toUpperCase();
            }
            args.method = args.method.toUpperCase();
            //request url
            if (args.method === 'GET') {
                //check request enctype
                if (args.enctype) {
                    throw new Error('Request failed. Please do not set enctype argument when you use GET method.');
                }
                //fill request data
                if (args.data) {
                    var A_query = [];
                    for (var key in args.data) {
                        if (args.data.hasOwnProperty(key)) {
                            var val = args.data[key];
                            if (val === null || val === undefined) {
                                val = '';
                            }
                            A_query.push(key + '=' + encodeURIComponent(val));
                        }
                    }
                    var query = A_query.join('&');
                    if (/\?/.test(args.url)) {
                        args.url += ('&' + query);
                    }
                    else {
                        args.url += ('?' + query);
                    }
                }
                args.data = null;
            }
            else if (args.method === 'POST') {
                args.enctype = args.enctype || 'URLENCODED'; //using urlencoded as default
                if (args.enctype === 'FORMDATA') {
                    args.data = new FormData();
                    for (var key1 in args.data) {
                        if (args.data.hasOwnProperty(key1)) {
                            args.data.append(key1, args.data[key1]);
                        }
                    }
                }
                else if (args.enctype === 'JSON') {
                    args.data = JSON.stringify(args.data);
                }
                else {
                    var arr = [];
                    for (var key in args.data) {
                        if (args.data.hasOwnProperty(key)) {
                            var val = args.data[key];
                            if (!val) {
                                arr.push(key + '=');
                            }
                            else if (typeof val === 'object') {
                                arr.push(key + '=' + encodeURIComponent(JSON.stringify(args.data[key])));
                            }
                            else {
                                arr.push(key + '=' + encodeURIComponent(args.data[key]));
                            }
                        }
                    }
                    args.data = arr.join('&');
                }
            }
            else {
                throw new Error('Please provide a valid method.');
            }
            if (args.isAsync === undefined) {
                args.isAsync = true;
            }
            var xhr = new XMLHttpRequest();
            xhr.open(args.method, args.url, args.isAsync);
            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    var contentType = xhr.getResponseHeader('Content-Type');
                    if (/application\/json|text\/json/.test(contentType)) {
                        resolve(JSON.parse(xhr.responseText), xhr);
                    }
                    else {
                        resolve(xhr.responseText, xhr);
                    }
                }
                else {
                    reject('server_error', xhr);
                }
            });
            if (args.progressFn) {
                xhr.addEventListener('progress', function () {
                    args.progressFn(xhr);
                });
            }
            xhr.addEventListener('error', function () {
                reject('network_error', xhr);
            });
            //set headers must be after xhr.open and before xhr.send
            for (var key in args.headers) {
                if (args.headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, args.headers[key]);
                }
            }
            if (args.enctype === 'JSON') {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            }
            else if (args.enctype === 'URLENCODED') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            xhr.send(args.data);
        });
    };
    Ajax.get = function (url, data, headers) {
        return Ajax.request({
            method: 'GET',
            headers: headers,
            data: data,
            url: url
        });
    };
    Ajax.post = function (url, data, headers, enctype) {
        return Ajax.request({
            method: 'POST',
            data: data,
            headers: headers,
            url: url,
            enctype: enctype
        });
    };
    return Ajax;
}());
module.exports = Ajax;
