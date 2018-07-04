var ajax = require('../index');

describe('ajax function tester', function (done) {
    // var testUrl1 = '/manage/user/query';
    // ajax.get(testUrl1, {})
    //     .then(function (result) {
    //         done(result);
    //     });
    var testUrl2 = 'http://local.meizu.com:3000/v2/api/table/query';
    var payload2 = {
        dbName:"MEIZU_CONTENTS",
        offset:0,
        pageSize:10,
        tableName:"T_CONTENT_DIS",
        test: {}
    }
    ajax.post(testUrl2, payload2)
        .then(function(res){
            done(res);
        });
});