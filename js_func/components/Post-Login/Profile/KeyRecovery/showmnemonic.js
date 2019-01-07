

const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();





function decryptData(encryptedData, privateKeyStr) {
  const privateKey = virgilCrypto.importPrivateKey(privateKeyStr);
  const decryptedDataStr = virgilCrypto.decrypt(encryptedData, privateKey);
  var decryptedData =  decryptedDataStr.toString('utf8');

  return decryptedData;
}


exports.decryptData = decryptData ;
