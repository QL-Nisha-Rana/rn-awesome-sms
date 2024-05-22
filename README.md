# react-native-awesome-sms

react-native-awesom-sms is a React Native package that allows your application to receive new SMS messages and retrieve SMS history on Android devices. This module provides seamless integration with the native Android SMS functionalities, enabling efficient message handling directly within your React Native app

## Permissions

This package requires the following permissions to be added to your `AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.READ_SMS"/>
<uses-permission android:name="android.permission.RECEIVE_SMS"/>
```

## Installation

```sh
npm install react-native-awesome-sms
```

## Usage

```js
import {
  checkAndRequestPermissions,
  getReceivedMessages,
} from 'react-native-awesome-sms';
```

## For Checking READ_SMS Permission and SMS History

```js
useEffect(() => {
  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      setPermissionsAndroidcheck(granted);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        checkAndRequestPermissions();
      } else {
        getReceivedMessages().then(setResult);
      }
    } catch (err) {
      console.warn(err);
    }
  };
});
```

## For INComing SMS

```js
React.useEffect(() => {
  if (PermissionsAndroidcheck === PermissionsAndroid.RESULTS.GRANTED) {
    let subscriber = DeviceEventEmitter.addListener(
      'onSMSReceived',
      (message) => {
        const { messageBody, senderPhoneNumber } = message;
        Alert.alert(
          'SMS received',
          `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`
        );
      }
    );

    return () => {
      subscriber.remove();
    };
  }
}, [PermissionsAndroidcheck]);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
