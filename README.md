# Plasma Wallet

A Plasma educational app that allows you to manage your fund on the Ethereum network and OmiseGO network.

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

## Running

1. `npm run start`
2. `npm run ios` to run on iOS on the simulator or `npm run android` to run on the Android real device.

## Developer Notes

### **Developing New Views**

The `warpNavigator` is set up as a view component directory that you can use to develop without being bound to the application flow.

To develop a new view component using the `warpNavigator`:

1. Open the `src/navigator/warp-portal/index.js`
2. Add new view route(s) for your component
3. Add button(s) to be an entrance to new route at `src/components/views/warp-portal/index.js`
4. In `src/router.js`, replace `AppNavigator` with `WarpPortalNavigator`

### **Known Issues**

- An error about auto-linking (e.g. `React Native CLI uses autolinking for native dependencies, but the following modules are linked manually`) when you `npm run ios` or `npm run android` does not cause known build issues. However, unlinking `react-native-background-fetch` as a result does. If you do this by mistake, run `react-native-link react-native-background-fetch` to link it again.
