var bitcoin = require('bitcore-lib');




function 	signTransaction(utxo, amount, from, privateKey, to) {
		var Unit = bitcoin.Unit;

		var transaction = new bitcoin.Transaction();

		transaction.from(utxo).to(to, amount).change(from);

		let size = transaction._estimateSize();

		let estimatedFees =  transaction._estimateFee(size,amount, 1000);
		let balance = 400020;   //estimated fees

		if((amount + estimatedFees) > balance){
			// Toast.showWithGravity('Amount should not be greater than balance', Toast.LONG, Toast.CENTER);
			// this.setState({loaded:true});
			return 'Amount should not be greater than balance'
		}

		else if(amount <= estimatedFees ){
			// Toast.showWithGravity('Amount should be greater than fee', Toast.LONG, Toast.CENTER);
			// this.setState({loaded:true});
			return 	'Amount should be greater than fee'	}


		else if((amount - estimatedFees) <= 0){
		Toast.showWithGravity('Amount should be greater than fee', Toast.LONG, Toast.CENTER);
		this.setState({loaded:true});
		}

		else{
			transaction.fee(estimatedFees);
			transaction.sign(privateKey);
			transaction = transaction.toString();
			hash = {};
			hash.transaction_hash = transaction;
			hash.address = from;
			hash.amount = Unit.fromSatoshis(amount).to(Unit.BTC);

      return hash ;
			// this.setState({activity: "Broadcasting Transaction"}, () => {
			// 	requestAnimationFrame(() => this.sendTransactionHash(hash), 0)
			// });
		}

	}




  exports.signTransaction = signTransaction ;
