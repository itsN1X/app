//
//
// import bip39 from 'react-native-bip39';
// import { VirgilCrypto } from 'virgil-crypto' ;
// const crypto = require('react-native-crypto');
//
//
//
//
// function generateKeyPair() {
//
//
// 		const virgilCrypto = new VirgilCrypto();
// 		let account = {};
// 		account.mnemonic = this.state.mnemonic;
// 		const seed = bip39.mnemonicToSeedHex(this.state.mnemonic);
// 		account.seed = seed;
// 		const keyPair = virgilCrypto.generateKeysFromKeyMaterial(seed);
// 		const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
// 		const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
// 		const privateKey = privateKeyData.toString('base64');
// 		const publicKey = publicKeyData.toString('base64');
// 		const privateKeyHash = this.createHash(privateKey)
//
//
// }
