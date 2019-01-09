var bitcoin = require('bitcore-lib');




function createKeys(){

  var privateKey = new bitcoin.PrivateKey();
  const privateKeyStr = privateKey.toString();

  var publicKey  = privateKey.toPublicKey();
  const publicKeyStr = publicKey.toString();

  var address = publicKey.toAddress(bitcoin.Networks.testnet);
  const addressStr = address.toString();

  let BTCData = {}
  BTCData.asset_id = 1;
  BTCData.privateKey = privateKeyStr;
  BTCData.publicKey = publicKeyStr;
  BTCData.address = addressStr;
  
  return BTCData;

}






exports.createKeys = createKeys;
