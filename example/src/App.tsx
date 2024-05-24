import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  DeviceEventEmitter,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  requestMessagePermission,
  getAllMessages,
  getIncomingMessages,
  getOutgoingMessages,
} from 'rn-awesome-sms';

export default function App() {
  const [allMessages, setAllMessages] = React.useState<[] | undefined>();
  const [ReceivedMessages, setReceivedMessages] = React.useState<
    [] | undefined
  >();
  const [sentMessages, setSentMessages] = React.useState<[] | undefined>();
  const [PermissionsAndroidcheck, setPermissionsAndroidcheck] =
    React.useState<string>();

  useEffect(() => {
    const requestSmsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS
        ).then(setPermissionsAndroidcheck);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          requestMessagePermission();
        } else {
          getAllMessages().then(setAllMessages);
          getIncomingMessages().then(setReceivedMessages);
          getOutgoingMessages().then(setSentMessages);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestSmsPermission();
  }, []);
  const Refresh = async () => {
    getAllMessages().then(setAllMessages);
    getIncomingMessages().then(setReceivedMessages);
    getOutgoingMessages().then(setSentMessages);
    console.log(sentMessages, ReceivedMessages);
  };
  useEffect(() => {
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
      <Text>Result: {allMessages?.length}</Text>
      <TouchableOpacity onPress={() => Refresh()}>
        <Text style={styles.text}>Refresh</Text>
      </TouchableOpacity>

      <FlatList
        data={allMessages}
        renderItem={({ item, index }) => {
          return (
            <View key={index} style={styles.message}>
              <Text style={styles.messageText}>
                Sender: {item?.senderPhoneNumber}
              </Text>
              <Text style={styles.messageText}>
                Message: {item.messageBody}
              </Text>
              <Text style={styles.messageText}>
                Timestamp: {new Date(item.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.messageText}>payee: {item.payee}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.timestamp}
      />
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
  titleText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
  },
  messageContainer: {
    flex: 1,
    marginTop: 16,
  },
  message: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    color: 'black',
  },
  noMessagesText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginTop: 32,
  },
  text: {
    fontSize: 45,
  },
});
