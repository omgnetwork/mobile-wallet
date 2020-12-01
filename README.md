# Plasma Wallet

A mobile application to manage your funds on the Ethereum and OMG networks.

## Requirements

- Node 10.22.0
- Ruby 2.6.6 and Bundler 2.1.4

\* _The version of Ruby is intended to match the version declared on the CircleCI macOS executor._

\* _Installing Fastlane and Cocoapods with Bundler is intended to control versions across machines._

## Installation

Run `npm install`

### For iOS

1. From the `/ios` folder, install Ruby dependencies with `bundle install`.
2. Install Pods with `bundle exec pod install`.

### For Android

1. `cd android/app && keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`

## Environment

Create `.env` file and add your configuration

```env
CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS=12
CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS=12
ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS=1
EXIT_PERIOD=<ENV_EXIT_PERIOD>
ETHERSCAN_API_KEY=<ETHERSCAN_API_KEY>
ETHERSCAN_API_URL=https://api-rinkeby.etherscan.io/api/
ETHERSCAN_URL=https://rinkeby.etherscan.io/
ETHEREUM_NETWORK=rinkeby
OMISEGO_NETWORK=lumpini
WEB3_HTTP_PROVIDER=<MW_PROXY_SERVER_URL>
PLASMA_FRAMEWORK_CONTRACT_ADDRESS=<PLASMA_CONTRACT_ADDRESS>
PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS=<EXIT_GAME_CONTRACT_ADDRESS>
ETH_VAULT_CONTRACT_ADDRESS=<ETH_VAULT_CONTRACT_ADDRESS>
ERC20_VAULT_CONTRACT_ADDRESS=<ERC20_VAULT_CONTRACT_ADDRESS>
WATCHER_URL=<WATCHER_URL>
BLOCK_EXPLORER_URL=<BLOCK_EXPLORER_URL>
SENTRY_DSN=<SENTRY_DSN>
SENTRY_ENVIRONMENT=sandbox-abcdef12-rinkeby-01
EXIT_PERIOD=<EXIT_PERIOD>
```

### For iOS

Download the `GoogleService-Info.plist` from [OMG Drive](https://drive.google.com/drive/folders/1MMak_4mg5IZ-mv2zBOEok9FCYlMPqf2v?usp=sharing) and insert it in `ios/PlasmaWallet/wallet/GoogleService-Info.plist`. (Required for both development and release)


### For Android

From files on the [drive](https://drive.google.com/drive/folders/1MMak_4mg5IZ-mv2zBOEok9FCYlMPqf2v):
   - Copy `release.keystore`, then paste at `android/app/release.keystore`
   - Copy `keystore.properties`, then paste at `android/keystore.properties`
   - Copy `google-services.json`, then paste at `android/app/google-servies.json`
   - Copy `GTM-5VHN7FC.json`, then paste at `ios/container/GTM-5VHN7FC.json`.
   - Copy `GTM-PGZXFH4.json`, then paste at `android/app/src/main/assets/containers/GTM-PGZXFH4.json`.

(Optional for development)

## Running

1. `npm run start`
2. `npm run ios` to run on iOS on the simulator or `npm run android` to run on the Android real device.

## Release

### Android

[Go to Android release doc](docs/release-android.md)

### iOS

[Go to iOS release doc](docs/release-ios.md)

## Testing

1. Copy `__mock__/react-native-config.example.js` to `__mock__/react-native-config.js` and fill the missing values

2. Run test with `npm run test`

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

- If you run into the rare case where you are stuck on the splash screen and the app doesn't want to load, try deleting the `GoogleService-Info.plist`, try the build and force an error, and then re-add the plist file.
