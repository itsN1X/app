
const assert = require('assert');
const bitcoin = require('../../js_func/BTC/bitcoin.js');



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
