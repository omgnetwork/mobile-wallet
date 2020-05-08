# Plasma Wallet

A Plasma educational app that allows you to manage your fund on the Ethereum network and OmiseGO network.

## Before Installation (Optional for development, but need for deployment)

Download all files at [OmiseGO Drive](https://drive.google.com/drive/folders/1MMak_4mg5IZ-mv2zBOEok9FCYlMPqf2v?usp=sharing)

## Installation

1. `npm install`
2. `cd ios && pod install`
3. `cd android/app && keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`
4. Create `.env` file and fill the missing data into the following template:

```
CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS=12
CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS=12
ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS=1
EXIT_PERIOD=<ENV_EXIT_PERIOD>
ETHERSCAN_API_KEY=<ETHERSCAN_API_KEY>
ETHERSCAN_API_URL=https://api-rinkeby.etherscan.io/api/
ETHERSCAN_URL=https://rinkeby.etherscan.io/
ETHERSCAN_NETWORK=rinkeby
OMISEGO_NETWORK=lumpini
WEB3_HTTP_PROVIDER=<MW_PROXY_SERVER_URL>
PLASMA_FRAMEWORK_CONTRACT_ADDRESS=<PLASMA_CONTRACT_ADDRESS>
PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS=<EXIT_GAME_CONTRACT_ADDRESS>
ETH_VAULT_CONTRACT_ADDRESS=<ETH_VAULT_CONTRACT_ADDRESS>
ERC20_VAULT_CONTRACT_ADDRESS=<ERC20_VAULT_CONTRACT_ADDRESS>
WATCHER_URL=<WATCHER_URL>
BLOCK_EXPLORER_URL=<BLOCK_EXPLORER_URL>
EXIT_PERIOD=<EXIT_PERIOD>

# For running test
MW_TEST_FUND_ADDRESS=<TEST_FUND_ADDRESS>
MW_TEST_FUND_PRIVATE_KEY=<TEST_FUND_PRIVATE_KEY>
MW_TEST_ADDRESS=<TEST_ADDRESS>
MW_TEST_PRIVATE_KEY=<TEST_PRIVATE_KEY>
```

5. From downloaded files,
   - Copy `release.keystore`, then paste at `android/app/release.keystore`
   - Copy `keystore.properties`, then paste at `android/keystore.properties`
   - Copy `google-services.json`, then paste at `android/app/google-servies.json`
   - Copy `GoogleService-Info.plist`, then paste at `ios/PlasmaWallet/wallet/GoogleService-Info.plist`
   - Copy `GTM-5VHN7FC.json`, then paste at `ios/container/GTM-5VHN7FC.json`.
   - Copy `GTM-PGZXFH4.json`, then paste at `android/app/src/main/assets/containers/GTM-PGZXFH4.json`.

## Running

1. `npm run start`
2. `npm run ios` to run on iOS on the simulator or `npm run android` to run on the Android real device.

## Release

### Android

[Go to Android release doc](docs/release-android.md)

### iOS

[Go to iOS release doc](docs/release-ios.md)

## Testing

Run test with `npm run test`

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
