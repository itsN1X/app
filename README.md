# coinsafe-app

Never Lose your Bitcoins ! A multicurrency wallet with key recovery support. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### System Requirements

Basic system configration required to run the application

```
- MacOs or Ubuntu 

```
### Prerequisites

What things you need to install the software and how to install them

```
- Android Studio 
- Node,npm and React Native

```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
git clone https://github.com/CoinsafeApp/coinsafe-app.git
cd coinsafe-app
npm install
react-native start
react-native run android
```


End with an example of getting some data out of the system or using it for a little demo

## Running the tests

```
npm test
```

### Break down into end to end tests

These tests check the front end javascript functions in the application, for example , keys generation

```

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
```


## Built With

* [React Native](https://facebook.github.io/react-native/) - The web framework used




## Authors

* **Tarun Gupta** - *Initial work* - [tarun gupta](https://github.com/tarun1475)


## License

This project is licensed under the GPL License - see the [LICENSE.md](LICENSE.md) file for details

