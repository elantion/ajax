//XMLHttpRequest 2
import ARGUMENTS from './interface/ARGUMENTS';
class Ajax {
    constructor(){
        //god know what I written.
    }
    public static request(args:ARGUMENTS):Promise<any>{
        return new Promise(function (resolve:(res:any, xhr?:XMLHttpRequest)=>void, reject:(error:string, xhr?:XMLHttpRequest)=>void) {
            if(args.enctype){
                args.enctype = args.enctype.toUpperCase();
            }
            args.method = args.method.toUpperCase();
            //request url
            if(args.method === 'GET'){
                //check request enctype
                if(args.enctype){
                    throw new Error('Request failed. Please do not set enctype argument when you use GET method.');
                }
                //fill request data
                if(args.data){
                    let A_query:string[] = [];
                    for(let key in args.data){
                        if(args.data.hasOwnProperty(key)){
                            let val = args.data[key];
                            if(val === null || val === undefined){
                                val = '';
                            }
                            A_query.push(key + '=' + encodeURIComponent(val));
                        }
                    }
                    let query:string = A_query.join('&');
                    if(/\?/.test(args.url)){
                        args.url += ('&' + query);
                    }else{
                        args.url += ('?' + query);
                    }
                }
                args.data = null;
            }else if(args.method === 'POST'){
                args.enctype = args.enctype || 'URLENCODED'; //using urlencoded as default
                if(args.enctype === 'FORMDATA'){
                    if(args.data instanceof FormData){
                        // No need to transfer it.
                    }else{
                        const formData = new FormData();
                        Object.keys(args.data).forEach(key=>{
                            formData.append(key, args.data[key]);
                        });
                        args.data = formData;
                    }
                }else if(args.enctype === 'JSON'){
                    args.data = JSON.stringify(args.data);
                }else{
                    let arr = [];
                    for(let key in args.data){
                        if(args.data.hasOwnProperty(key)){
                            const val = args.data[key];
                            if(!val){
                                arr.push(key + '=');
                            }else if(typeof val === 'object'){
                                arr.push(key + '=' + encodeURIComponent(JSON.stringify(args.data[key])));
                            }else{
                                arr.push(key + '=' + encodeURIComponent(args.data[key]));
                            }
                        }
                    }
                    args.data = arr.join('&');
                }
            }else{
                throw new Error('Please provide a valid method.')
            }
            if(args.isAsync === undefined){
                args.isAsync = true;
            }
            let xhr:XMLHttpRequest = new XMLHttpRequest();
            xhr.open(args.method, args.url, args.isAsync);
            xhr.addEventListener('load', function () {
                if(xhr.status === 200){
                    let contentType = xhr.getResponseHeader('Content-Type') || '';
                    if(/application\/json|text\/json/.test(contentType)){
                        resolve(JSON.parse(xhr.responseText), xhr);
                    }else{
                        resolve(xhr.responseText, xhr);
                    }
                }else{
                    reject('server_error', xhr);
                }
            });
            if(typeof args.progressFn === 'function'){
                xhr.addEventListener('progress', args.progressFn);
            }
            xhr.addEventListener('error', function() {
                reject('network_error', xhr);
            });
            //set headers must be after xhr.open and before xhr.send
            for(let key in args.headers){
                if(args.headers.hasOwnProperty(key)){
                    xhr.setRequestHeader(key, args.headers[key]);
                }
            }
            if(args.enctype === 'JSON'){
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            }else if(args.enctype === 'URLENCODED'){
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            xhr.send(args.data);
        });
    }
    public static get(url:string, data?:any, headers?:any){
        return Ajax.request({
            method: 'GET',
            headers,
            data,
            url
        });
    }
    public static post(url:string, data?:any, headers?:any, enctype?:string) {
        return Ajax.request({
            method: 'POST',
            data,
            headers,
            url,
            enctype
        });
    }
}
export = Ajax;
