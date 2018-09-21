# Workspaces React Native Demo

A sample project that demonstrates authentication to a real Workspaces server `devsummit.watchdox.com`, 
fetches some pre-populated workspaces, folders, and documents, and suggests 3 easy exercises for developers.


## Prerequisites
 * XCode developer tools for iOS development
 * Android emulator
 * npm install / yarn install
 * Basic JS knowledge



## Instructions
Clone repository:
```sh
git clone https://github.com/blackberry/BlackBerryWorkspacesSamples.git
cd Workspaces React Native Demo
```

Install with `npm` or `yarn`:

```sh
npm install
yarn install
```

### Run iOS project

```sh
npm run start:ios
```
Or manually
```sh
react-native run-ios --port 8099
```


### Run Android project

```sh
npm run start:android
```
Or manually
```sh
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
react-native run-android --port 8099
```


### Use the following credentials
* Site: devsummit.watchdox.com
* User: devsummit1@ahem.email
* Password: Aa111111

## Online help
[BlackBerry Workspaces SDK](http://help.blackberry.com/en/blackberry-workspaces-sdk/)
