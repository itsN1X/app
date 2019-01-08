const assert = require('assert');
const bitcoin = require('../js_func/BTC/bitcoin.js');
const recovery = require('../js_func/recovery/recovery.js');
const pin = require('../js_func/Pre-Login/pin.js');
const restore = require('../js_func/Pre-Login/restore.js');
const send = require('../js_func/BTC/send.js');


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



//btc transaction related functions



describe('signs the transaction',function(){

  let utxo = [{"txid":"b89daaf4f6f7d72224c865133124a0a314920cde83c21c8098238c60d49c2502","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.001,"confirmations":5072,"spendable":false,"solvable":false,"safe":true},{"txid":"de8fbd4fe72dea28101eae3f78d0c843ee41619fe1df8403e3178ca62a01a204","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.001,"confirmations":5072,"spendable":false,"solvable":false,"safe":true},{"txid":"7a29ab2bcfe8fa657463f14045109990f5bfe3057807e3c21c360589b0bcf716","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.001,"confirmations":5072,"spendable":false,"solvable":false,"safe":true},{"txid":"abddac3ca098a26c64cdcc3f21b668a815de176cd1a5c7bd8fa79d38f35fd324","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.000997,"confirmations":2827,"spendable":false,"solvable":false,"safe":true},{"txid":"b635e44cba29a562c3a75b6fbd8ec8131f156c1d9e2e6496328df15397df1f32","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0019,"confirmations":4834,"spendable":false,"solvable":false,"safe":true},{"txid":"6fbaff55c0216f58fbe8819d1faa755dc26b2507b0bcb871e0411ecd277ad036","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.002359,"confirmations":2827,"spendable":false,"solvable":false,"safe":true},{"txid":"afb9fba00cb7324567a582684d1ab76fca6697c49327bb1f9b81580e5347cd38","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0022,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"73884952309ac965f612e2f3625886f3a266a0b5ca6fcb33ea9727f69b8fb149","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.65630087,"confirmations":2864,"spendable":false,"solvable":false,"safe":true},{"txid":"7e8d91388d0283149f552998844492fae8add872249cfeb91cdce2df3295af4e","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0001,"confirmations":5286,"spendable":false,"solvable":false,"safe":true},{"txid":"d7cb3db596e69e8bc5c542c46559b43935ecfc677cadf4245e20ad73791b4d4f","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0001,"confirmations":2829,"spendable":false,"solvable":false,"safe":true},{"txid":"6bd287720f09229ec6a7f46979f52df5650509d6de2c91e23c4e60b62184c150","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0021,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"81ce7cfadbf5fb19066d90881e238cca79dc5300eb6889980bfd8a6cb75f6453","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.001,"confirmations":5072,"spendable":false,"solvable":false,"safe":true},{"txid":"196121f98857f2cb9a59dc3c7fb1050620329bb035b25e0b0c86079941a82b55","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.01,"confirmations":2863,"spendable":false,"solvable":false,"safe":true},{"txid":"32800034f85f2a58bdc69c43ebec8375af082fa405c836d4e251d96b8b6ae255","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0022,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"42d768aa1d2a2e1418c9102e7c057f8d7c6681b6fdf1e8983ff8ee3d913a6d79","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.002,"confirmations":2854,"spendable":false,"solvable":false,"safe":true},{"txid":"07ed8b364a92de0910c712f5bf314faed143bd57f2ee9032981cbf73dc244081","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.001,"confirmations":5072,"spendable":false,"solvable":false,"safe":true},{"txid":"870c85930ce38c53a59ab2fe8eba4ffaf13059e3c650e341744eb281ce3e6287","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0021,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"4149bb1d8d9398bb841b155b6173b677f8f7605dfdb55e02017f66796547d692","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0023,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"dd0edd417bde9fbb6eb890ad161b117c3418dbb10f89d4335da8e6fc535a1496","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0022,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"e75f929901de27f5438dde892904884f08386a89f9090ef9030d9400fa9ada9e","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.01,"confirmations":2863,"spendable":false,"solvable":false,"safe":true},{"txid":"047116a85823c0382f11f7c04950b545d468409fe6587478696e2670a0e1e1a3","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.001,"confirmations":5072,"spendable":false,"solvable":false,"safe":true},{"txid":"5ec55becfca7bbc9aea711aead34dbd75d0e735f4f8ded5e2201669bb96755a7","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0023,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"dda5a2ebbbc27d09590f0c8b54bafcaa988f1894f7f729c499fb0243a93f56bd","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0022,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"1365201aa0d83aa18845b6e94afe2abf027ee98361f60175a673482cc263d8c0","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0021,"confirmations":5294,"spendable":false,"solvable":false,"safe":true},{"txid":"c86b5bf1d5f42eec5ca84a2c80ea9c387790957c6997592c77d45023b76ec9d2","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0023,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"9aea0b284cda841463c5a431678885098721fcec946cce8206bbe2451d2175d4","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0023,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"6f3efbb5e2a3a8c62b1dcf63024aa129ade7ab7f464f3421a72371424bc21fef","vout":1,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0022,"confirmations":5295,"spendable":false,"solvable":false,"safe":true},{"txid":"1fd21fe59d3dd887ca2b7a17e273fad92b107bd7a9aea9432129054969750bfd","vout":0,"address":"myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH","account":"","scriptPubKey":"76a914c71f6c7dcc76d87440e47d3fd2623625f9d0e4c788ac","amount":0.0022,"confirmations":5295,"spendable":false,"solvable":false,"safe":true}] ;
  let amount;
  let from = 'myfpQbH489pyt7nDFrWz8ZrrkcnmtrbyKH';
  let privateKey= 'b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb71' ;
  let to = 'n4HY51WrdxATGEPqYvoNkEsTteRfuRMxpD' ;


  it('checks amount should not be greater than balance', function () {

    var res = send.signTransaction(utxo,2100,from,privateKey,to)


    assert.equal(res,'Amount should not be greater than balance' );
  })


  it('checks amount should not be less than fees', function () {

    var res = send.signTransaction(utxo,15,from,privateKey,to)

    assert.equal(res,'Amount should be greater than fee');
  })

  it('signs the transaction', function () {

    var res = send.signTransaction(utxo,400015,from,privateKey,to)

    assert.notEqual(res,null)
  })

})





// signing function
