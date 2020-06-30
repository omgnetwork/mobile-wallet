# Release iOS IPA to the Testflight

## Installation

1. Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

2. Install _fastlane_ using `brew cask install fastlane` or alternatively `[sudo] gem install fastlane -NV`.

3. Create a `.env.default` file in the `ios` folder and add your configuration:

```env
FASTLANE_USER     Your App Store Connect Email
MATCH_GIT_URL     The URL of the GitHub repo containing certificates and provisioning profiles for match signing
```

4. If not done already, link [Sentry](https://docs.sentry.io/platforms/react-native/#linking) by running `npx sentry-wizard -i reactNative -p ios android`.

5. If not done already, insert `GoogleService-Info.plist` into `ios/PlasmaWallet/wallet`. You can find it in the [OMG drive](https://drive.google.com/drive/folders/1MMak_4mg5IZ-mv2zBOEok9FCYlMPqf2v?usp=sharing).

5. From the `/ios` directory, run `bundle exec pod install`.

6. Ensure the `MARKETING_VERSION` fields in `ios/PlasmaWallet.xcodeproj/project.pbxproj` are set to the desired version.

7. Also from the `/ios` directory, run `bundle exec fastlane ios testflight_local` and wait for the job to complete.

8. Go to https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1482235242 (You need to login first)

9. Go to `Testflight`, then please follow steps below:

![ios-archive-instruction-12](../public/ios-archive-instruction-12.png)

![ios-archive-instruction-13](../public/ios-archive-instruction-13.png)

![ios-archive-instruction-14](../public/ios-archive-instruction-14.png)

**Note**: If you found error about `library not found for -lPods-PlasmaWallet` when archiving, the temporary solution was to:

1. Go to General
2. Scroll down to `Frameworks, Libraries, and Embedded Content`
3. Remove `libPods-PlasmaWallet.a`.
4. Archive again.

For reference:

![fix-ios-error](../public/fix-ios-error.png)


## Note on CircleCI Release

### Versioning

The version is set in the `MARKETING_VERSION` fields found in `ios/PlasmaWallet.xcodeproj/project.pbxproj`. 

Ensure this is updated in order to pair your build with the right version number on TestFlight.

### Encrypted Files

The following files are stored as `base64` strings in the CircleCI environment: 

- `.env`
- `GoogleService-Info.plist`
- `sentry.properties`

To change these files, encrypt the updated versions into `base64` and store them on CircleCI. 

**Note**: the `.env` file currently needs to be updated for any version bump. 

