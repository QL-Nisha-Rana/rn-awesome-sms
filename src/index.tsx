/* eslint-disable prettier/prettier */
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
	`The package 'rn-awesome-sms' doesn't seem to be linked. Make sure: \n\n` +
	Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo Go\n';

const AwesomeSms = NativeModules.AwesomeSms
	? NativeModules.AwesomeSms
	: new Proxy(
		{},
		{
			get() {
				throw new Error(LINKING_ERROR);
			},
		}
	);
export function getAllMessages() {
	return AwesomeSms.getAllMessages();
}
export function getIncomingMessages() {
	return AwesomeSms.getReceivedMessages();
}
export function requestMessagePermission() {
	return AwesomeSms.checkAndRequestPermissions();
}

export function getOutgoingMessages() {
	return AwesomeSms.getSentMessages();
}
