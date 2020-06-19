# fastlane documentation

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using

```
[sudo] gem install fastlane -NV
```

or alternatively using `brew cask install fastlane`

# Environment Variables

Create a `.env.default` file in the `ios` folder and add your configuration:

```env
APPLE_ID=         Your Apple ID
TEAM_ID=          Your Apple Developer Portal Team ID
ITC_TEAM_ID       Your iTunes Connect Team ID
MATCH_GIT_URL     The URL of the GitHub repo containing certificates and provisioning profiles for match signing
```

# Available Actions

## iOS

### ios testflight_local

```
fastlane ios testflight_local
```

Push a new build to TestFlight (local)

---

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
