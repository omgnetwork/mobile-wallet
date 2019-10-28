# Plasma Wallet

A Plasma educational app that allows you to manage your fund on the Ethereum network and OmiseGO network.

## Before Installation

Download all files at [OmiseGO Drive](https://drive.google.com/drive/folders/1MMak_4mg5IZ-mv2zBOEok9FCYlMPqf2v?usp=sharing)

## Installation

1. `npm install`
2. `cd ios && pod install`
3. `cd android/app && keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`
4. Create `.env` file and fill the missing data into the following template:

```
CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS=12
CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS=12
CHILDCHAIN_WATCHER_WAIT_DURATION=60000
ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS=1
ROOTCHAIN_GAS_LIMIT=150000
ETHERSCAN_API_KEY=<ETHERSCAN_API_KEY>
ETHERSCAN_API_URL=https://api-rinkeby.etherscan.io/api/
ETHERSCAN_TX_URL=https://rinkeby.etherscan.io/tx/
ETHERSCAN_ADDRESS_URL=https://rinkeby.etherscan.io/address/
ETHERSCAN_NETWORK=rinkeby
OMISEGO_NETWORK=lumpini
WEB3_HTTP_PROVIDER=https://rinkeby.infura.io/v3/<INFURA_PROJECT_ID>
PLASMA_CONTRACT_ADDRESS=<PLASMA_CONTRACT_ADDRESS>
CHILDCHAIN_WATCHER_URL=<CHILDCHAIN_WATCHER_URL>
BLOCK_EXPLORER_URL=<BLOCK_EXPLORER_URL>
EXIT_PERIOD=<EXIT_PERIOD>
```

5. From downloaded files,
   - Copy `release.jks`, then paste at `android/app/release.jks`
   - Copy `keystore.properties`, then paste at `android/keystore.properties`
   - Copy `google-services.json`, then paste at `android/app/google-servies.json`
   - Copy `GoogleService-Info.plist`, then paste at `ios/PlasmaWallet/wallet/GoogleService-Info.plist`

## Running

1. `npm run start`
2. `npm run ios` to run on iOS on the simulator or `npm run android` to run on the Android real device.

## Release

### Android

Generate the release apk by running `cd android && ./gradlew assembleRelease`

### iOS

`TODO`
