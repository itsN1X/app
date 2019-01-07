
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();
const Cryptr = require('cryptr');
const secrets = require('secret-sharing.js');






function getNewKeys() {
  const keyPair = virgilCrypto.generateKeys();
  const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
  const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
  const privateKey = privateKeyData.toString('base64');
  const publicKey = publicKeyData.toString('base64');

  var data = {} ;
  data.keyPair = keyPair ;
  data.privateKey = privateKey ;
  data.publicKey = publicKey ;

  return data ;
}




function getSecretParts(mnemonic){
  const cryptr = new Cryptr('Hello');
  const encryptedString = cryptr.encrypt(mnemonic);
  var shares = secrets.share(encryptedString, 3, 2);
  return shares;
}


function createTrustData() {
  const friends = this.state.friends;
  const shares = this.getSecretParts(this.state.mnemonic);
  var trust_data = [];
  for (i = 0; i < friends.length; i++) {
    var data = {};
    data.user_public_key = friends[i].address;
    var messageToEncrypt = {};
    messageToEncrypt.username = this.state.username;
    messageToEncrypt.user_public_key = this.state.publicKey;
    messageToEncrypt.secret = shares[i];
    messageToEncrypt = JSON.stringify(messageToEncrypt);
    data.encrypted_key_data = this.encryptData(messageToEncrypt, friends[i].address);
    trust_data.push(data);
  }
  this.sendTrustData(trust_data);
}



function encryptData(data, publicKeyStr) {
  		const publicKey = virgilCrypto.importPublicKey(publicKeyStr);
  		const encryptedDataStr = virgilCrypto.encrypt(data, publicKey);
  		const encryptedData =  encryptedDataStr.toString('base64');
  		return encryptedData;
  	}


function 	createRecoveryTrustData() {
		const friends = this.state.friends;
		var trustData = [];
	    for(i=0 ; i<friends.length ; i++) {
			var dataObject = {};
			dataObject.user_public_key = friends[i].address;
			trustData.push(dataObject);
	    }
	    this.sendRecoveryTrustData(trustData);
	}

function 	recoverMnemonic() {
		const shares = this.getShares();
		const cryptr = new Cryptr('Hello');
  		var comb = secrets.combine(shares);
  		var mnemonicstr = cryptr.decrypt(comb);
			mnemonic = mnemonicstr.split(" ",12);
			if(bip39.validateMnemonic(mnemonicstr)){
				this.setState({mnemonicstr: mnemonicstr, mnemonic: mnemonic, loaded: true,validateMnemonic:true});
			}

			else{
				this.setState({mnemonic: mnemonic,loaded: true,validateMnemonic:true});
				Toast.showWithGravity('Sorry, Not a valid Mnemonic!', Toast.LONG, Toast.CENTER);
			}
			// this.updateRequestStatus();
	}


function 	getShares() {
		var shares = [];


			for(i =0 ; i < this.props.data.length; i++){
				if(this.props.data[i].trust_status == 1){
					var decryptedData = this.decryptData(this.props.data[i].trust_data, this.props.privateKey);
					shares.push(decryptedData);
				}
			}

		return shares;
	}

function 	decryptData(encryptedData, privateKeyStr) {
		const privateKey = virgilCrypto.importPrivateKey(privateKeyStr);
		const decryptedDataStr = virgilCrypto.decrypt(encryptedData, privateKey);
		var decryptedData =  decryptedDataStr.toString('utf8');

		return decryptedData;
	}


exports.getNewKeys = getNewKeys ;
exports.getSecretParts = getSecretParts ;
exports.encryptData = encryptData ;
exports.createRecoveryTrustData = createRecoveryTrustData;
exports.recoverMnemonic = recoverMnemonic;
exports.decryptData = decryptData ;
