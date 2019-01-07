


const crypto = require('crypto');
var bip39 = require('bip39')
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();


function 	createHash(data) {
		const hash = crypto.createHash('sha256');
		hash.update(data);
		const privateKeyHash = hash.digest('hex');
		return privateKeyHash;
	}




function 	generateKeyPair() {
		let account = {};
		account.mnemonic = 'release husband spider chicken fresh spin alpha symptom man story minute coffee'
		const seed = bip39.mnemonicToSeedHex(account.mnemonic);
		account.seed = seed;
		const keyPair = virgilCrypto.generateKeysFromKeyMaterial(seed);
		const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
		const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
		const privateKey = privateKeyData.toString('base64');
		const publicKey = publicKeyData.toString('base64');
		const privateKeyHash = createHash(privateKey)
		account.publicKey = publicKey;
		account.privateKey = privateKey;
		account.privateKeyHash = privateKeyHash;
		let details = {};
		details.private_key_hash = privateKeyHash;
		details.public_key = publicKey;
		// this.authenticateUser(details, account);

    return details;
	}


exports.createHash = createHash ;
exports.generateKeyPair = generateKeyPair ;
