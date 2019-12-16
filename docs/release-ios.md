# Release iOS IPA to the Testflight

1. Open Xcode at `ios`
2. If you don't have apple ids belong to OmiseGO team, get that first, then go to `Preference > Accounts` and add it.
3. In `Signing & Capabilities` make sure that the team is `Omise Go Pte. Ltd`
4. In `General` bump the build version so it won't conflict with the previous builds.
5. Go to `Product > Archive` waiting the build to finish, then follow the instructions below:

![ios-archive-instruction-3](../public/ios-archive-instruction-4.png)

![ios-archive-instruction-5](../public/ios-archive-instruction-5.png)

![ios-archive-instruction-6](../public/ios-archive-instruction-6.png)

![ios-archive-instruction-7](../public/ios-archive-instruction-7.png)

![ios-archive-instruction-8](../public/ios-archive-instruction-8.png)

![ios-archive-instruction-9](../public/ios-archive-instruction-9.png)

![ios-archive-instruction-10](../public/ios-archive-instruction-10.png)

![ios-archive-instruction-11](../public/ios-archive-instruction-11.png)

6. Go to https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1482235242 (You need to login first)

7. Go to `Testflight`, then please follow steps below:

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
