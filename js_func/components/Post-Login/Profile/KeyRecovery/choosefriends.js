
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();
const Cryptr = require('cryptr');
// import bip39 from 'react-native-bip39';
// const bip39 = require('react-native-bip39');







function getNewKeys() {
  const keyPair = virgilCrypto.generateKeys();
  const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
  const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
  const privateKey = privateKeyData.toString('base64');
  const publicKey = publicKeyData.toString('base64');

  let key = {} ;

  key.keyPair = keyPair;
  key.privateKeyData = privateKeyData ;
  key.publicKeyData = publicKeyData ;
  key.privateKey = privateKey;
  key.publicKey = publicKey ;

  return key;
}


//
// function encryptDataOnPin (pin) {
// 		const cryptr = new Cryptr(pin);
// 		const promise = bip39.generateMnemonic();
//
// 		promise.then((result)=>{
// 			let data = cryptr.encrypt(result);
// 			// this.storeData(data);;
//       return data ;
// 		})
//
// 	}


// exports.encryptDataOnPin = encryptDataOnPin;
exports.getNewKeys= getNewKeys ;
