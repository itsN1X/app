const assert = require('assert');
const restore = require('../../js_func/Pre-Login/restore.js');


describe('creates hash from data ',function(){

 let secret = '1234';

  it('private key hash is not null', function () {

    var res = restore.createHash(secret);
    // console.log(res)

    assert.notEqual(res,null);
    assert.notEqual(res,undefined);
  })

})


describe('generates key pair for restoring',function(){


  it('generated key pairs are not null', function () {

    var res = restore.generateKeyPair();

    assert.notEqual(res,null);
    assert.notEqual(res,undefined);
  })

})
