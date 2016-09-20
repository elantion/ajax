var ajax = require('../index');

describe('ajax function tester', function (done) {
    var testUrl1 = '/manage/user/query';
    ajax.get(testUrl1, {})
        .then(function (result) {
            done(result);
        });
});