

const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();
var bip39 = require('bip39')
const Cryptr = require('cryptr');


function generateKeyPair() {

  const data = bip39.generateMnemonic();


    return data ;
}


function encryptDataOnPin(pin) {
		const cryptr = new Cryptr(pin);
		const promise = bip39.generateMnemonic();

		// promise.then((result)=>{
			let data = cryptr.encrypt(promise);
			return data ;
		// })

	}


exports.generateKeyPair = generateKeyPair ;
exports.encryptDataOnPin = encryptDataOnPin ;
