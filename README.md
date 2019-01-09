# coinsafe-app

CoinSAfe is a crossplatform (iOS, Android), GPL-licensed, multicurrency wallet app built in React Native .

The app supports key recovery using Shamir's secret algorithm.


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

## Future Work

**Features to be added - **
- [ ] Support for ethereum and monero 
- [ ] HD wallet support
- [ ] Multi-sig support 
- [ ] Exchange Feature

### Issues

Feel free to submit issues and enhancement requests.

### Contributing

1. Fork the repo on GitHub
2. Clone the project to your own machine
3. Commit changes to your own branch
4. Push your work back up to your fork
5. Submit a Pull request so that we can review your changes

## License

This project is licensed under the GPL License - see the [LICENSE.md](LICENSE.md) file, which guarantees end users the freedom to study, share, and modify the software.

Note that this license does not give free reign to redistribute the name and branding of quirk. So if you'd like to publish your own version, please rename it to avoid end-user confusion.

