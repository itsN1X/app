const assert = require('assert');
const pin = require('../../js_func/Pre-Login/pin.js');




describe('generates key pair',function(){

  it('checks the keyhash is not null', function () {

    var res = pin.generateKeyPair();

    assert.notEqual(res,null);
    assert.notEqual(res,undefined);
  })

})



describe('encrypts data on pin',function(){

 let secret = '1234';

  it('encrypted data is not null', function () {

    var res = pin.encryptDataOnPin(secret);
    // console.log(res)

    assert.notEqual(res,null);
    assert.notEqual(res,undefined);
  })

})
