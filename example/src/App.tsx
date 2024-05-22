import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  DeviceEventEmitter,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  checkAndRequestPermissions,
  getReceivedMessages,
} from 'react-native-awesome-sms';

export default function App() {
  const [result, setResult] = React.useState<[] | undefined>();
  const [PermissionsAndroidcheck, setPermissionsAndroidcheck] = useState();
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

    requestSmsPermission();

    return () => {
      granted.remove();
    };
  }, []);
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
  return (
    <View style={styles.container}>
      <Text>Result: {result?.length}</Text>
      <TouchableOpacity
        onPress={() => {
          getReceivedMessages().then(setResult);
        }}
      >
        <Text>Reload</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // checkAndRequestPermissions();
        }}
      >
        <Text>check Per</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
