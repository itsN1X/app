const assert = require('assert');
const showMnemonic = require('../js_func/components/Post-Login/Profile/KeyRecovery/showmnemonic.js')
const chooseFriends = require('../js_func/components/Post-Login/Profile/KeyRecovery/choosefriends.js');
const bitcoin = require('../js_func/BTC/bitcoin.js');
const recovery = require('../js_func/recovery/recovery.js');
const pin = require('../js_func/Pre-Login/pin.js');
const restore = require('../js_func/Pre-Login/restore.js')



describe('checks keys are of correct format', function () {
  describe('create new keys for recovery', function () {
    it('checks new keys are not null', function () {
      var data = chooseFriends.getNewKeys();
      assert.notEqual(data,null)
    })

  })

})



describe('checks btc keys and address generation', function(){

  var data = bitcoin.createKeys() ;

  it('should check address is regular testnet address', function(){

    var btcaddress = data.address;
    console.log(btcaddress)
    assert.equal(btcaddress[0],'m' || 'n')
  })

  it('should check private key is of correct format',function(){
    var privateKey = data.privateKey ;
    var exp = new RegExp(/^[-A-Za-z0-9+=]{1,50}|=[^=]|={3,}$/)
    var res = exp.test(privateKey) ;

    assert.equal(res,true)

  })

  it('should check public key is of correct format',function(){
    var publicKey = data.publicKey ;
    console.log(publicKey);
    var exp = new RegExp(/^[-A-Za-z0-9+=]{1,50}|=[^=]|={3,}$/)
    var res = exp.test(publicKey) ;
    assert.equal(res,true)

  })

  it('should check asset id of btc',function(){
    var asset_id = data.asset_id ;

    assert.equal(asset_id,1)

  })
})


// checks recovery related functions


describe('checks keys are of correct format', function () {
  describe('create new keys for recovery', function () {
    it('checks private key is not null', function () {
      var data = recovery.getNewKeys();
      assert.notEqual(data.privateKey,null)
    })


    it('checks public key is not null', function () {
      var data = recovery.getNewKeys();
      assert.notEqual(data.publicKey,null)
    })




  })

})



describe('checks share', function () {
  let mnemonic = 'release husband spider chicken fresh spin alpha symptom man story minute coffee';
  let incorrectmnemonic = 'release husband spider chicken fresh spin alpha symptom man story minute tea'

  describe('tests secret sharing function for 2 is to 3', function () {
    it('checks secret shares are not null', function () {
      var data = recovery.getSecretParts(mnemonic);
      assert.notEqual(data,null)
    })

    it('checks all the secrets are unique', function () {
      var data = recovery.getSecretParts(mnemonic);
      function checkIfArrayIsUnique(data) {
    return data.length === new Set(data).size;
  }

  var res = checkIfArrayIsUnique(data);
      assert.equal(res,true)
    })

    //
    // it('prompts mnemonic should not be empty', function () {
    //   var data = recovery.getSecretParts();
    //   console.log(data)
    //   assert.throws(data,Error)
    // })


  })

})



describe('encrypt data', function () {

  let data = 'some random data' ;
  let publicKeyStr = 'MCowBQYDK2VwAyEAYEZBTg+0q2b+zXJloGGYn5EqRL1RjCjsa7VX6cjMJFw='

  it('checks encrypted data is not null', function(){

    var res =recovery.encryptData(data,publicKeyStr);
    console.log(res)
    assert.notEqual(res,null);
  })

  it('checks base64 encoding', function(){

    var base64regex = /^[-A-Za-z0-9+=]{1,50}|=[^=]|={3,}$/;
    var pattern = new RegExp(base64regex);


    var result =recovery.encryptData(data,publicKeyStr);
    var res = pattern.test(result)
    assert.notEqual(res,false);
  })


})


describe('decrypts data', function () {

  let encryptedData = 'MIIBSQIBADCCAUIGCSqGSIb3DQEHA6CCATMwggEvAgECMYIBADCB/QIBAqAKBAiwqFHmEVMoRjAHBgMrZXAFAASB4jCB3wIBADAqMAUGAytlcAMhAF9jL9PKdAL88U3u4iA/iet+LGuJUbQgZTN/TgZPp9DsMBgGByiBjHECBQIwDQYJYIZIAWUDBAICBQAwQTANBglghkgBZQMEAgIFAAQwfsK7jdnqhOlIPeHrrrNd38eZF9JdXBE6/6T4RWJLt1MHWzXvMr1+ey1H7BLD5jZBMFEwHQYJYIZIAWUDBAEqBBAs4Ex1nbTepyKtNT8lXS06BDBiIuQIpB4ii5K0epcncTwylXY2d9OdAsP1fKFdSLJmURjuB5gGkSPi+WeFlGuNu5IwJgYJKoZIhvcNAQcBMBkGCWCGSAFlAwQBLgQM+uyQvChHAqkmDTQtC5ZnQTyU2h2h8iqoYhsXzkZ2BbBni48FnjVUYQ6/6GY=' ;
  let privateKeyStr = 'MC4CAQAwBQYDK2VwBCIEIOR7DWtHOyxfjwJy74EpbYpdwbKskuqimxB7GrmHu658'

  it('checks decrypted data is not null', function(){

    var res =recovery.decryptData(encryptedData,privateKeyStr);
    console.log(res)
    assert.notEqual(res,null);
  })

  it('checks base64 encoding', function(){

    var base64regex = /^[-A-Za-z0-9+=]{1,50}|=[^=]|={3,}$/;
    var pattern = new RegExp(base64regex);


    var result =recovery.decryptData(encryptedData,privateKeyStr);
    var res = pattern.test(result)
    assert.notEqual(res,false);
  })


})


// pin related functions

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
