# rn-awesome-sms

**rn-awesome-sms** is a comprehensive React Native package designed to enhance your application's SMS handling capabilities on Android devices. This module allows your app to seamlessly receive new SMS messages, retrieve SMS history, and manage sent, received, and all SMS messages efficiently. With native integration into Android's SMS functionalities, `rn-awesome-sms` provides robust and reliable SMS management directly within your React Native app.

## Getting started

## Installation

Install the library using npm:

```sh
npm install rn-awesome-sms
```

Install the library using either Yarn:

```sh
yarn add rn-awesome-sms
```

## Permissions

Ensure the following permissions are added to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_SMS"/>
<uses-permission android:name="android.permission.RECEIVE_SMS"/>
```

## Usage

Importing the Package

```js
import {
  requestMessagePermission,
  getAllMessages,
  getIncomingMessages,
  getOutgoingMessages,
} from 'rn-awesome-sms';
```

## For Checking READ_SMS Permission and SMS History

Use the following example to check for SMS permissions and retrieve SMS history:

```js
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
import {
  getAllMessages,
  getIncomingMessages,
  getOutgoingMessages,
} from 'rn-awesome-sms';

const MyComponent = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  useEffect(() => {
    const requestSmsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionsGranted(true);
          getAllMessages().then(setAllMessages);
          getIncomingMessages().then(setReceivedMessages);
          getOutgoingMessages().then(setSentMessages);
        } else {
          setPermissionsGranted(false);
          Alert.alert('Permission Denied', 'SMS permission is required to retrieve messages.');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestSmsPermission();
  }, []);

  return (
    // Your component JSX
  );
};

```

## Subscribing to Incoming SMS

The following example shows how to subscribe to incoming SMS messages:

```js
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, DeviceEventEmitter, Alert } from 'react-native';
import { requestMessagePermission } from 'rn-awesome-sms';

const MyComponent = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const requestSmsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionsGranted(true);
        } else {
          setPermissionsGranted(false);
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestSmsPermission();
  }, []);

  useEffect(() => {
    if (permissionsGranted) {
      const subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        (message) => {
          const { messageBody, senderPhoneNumber } = message;
          Alert.alert(
            'SMS received',
            `Message Body: ${messageBody} \nSender Number: ${senderPhoneNumber}`
          );
        }
      );

      return () => {
        subscriber.remove();
      };
    }
  }, [permissionsGranted]);

  return (
    // Your component JSX
  );
};

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

## Keywords

- React Native
- SMS
- Android
- SMS Management
- React Native SMS
- Receive SMS
- Read SMS
- Send SMS
- SMS History
