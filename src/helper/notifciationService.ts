import { secureStorage } from '@/utils/secureStorage';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AuthorizationStatus, getMessaging, getToken, requestPermission } from '@react-native-firebase/messaging';

function getMessagingInstance(): FirebaseMessagingTypes.Module | null {
  try {
    return getMessaging();
  } catch (e) {
    console.warn('[notifciationService] Firebase not ready:', (e as Error).message);
    return null;
  }
}

const getFCMToken = async (messagingInstance: FirebaseMessagingTypes.Module) => {
  try {
    const fcmToken = await secureStorage.getItem('FCM_TOKEN');
    console.log('fcmToken', fcmToken);
    if (!!fcmToken) {
      return fcmToken;
    }
    const token = await getToken(messagingInstance);
    if (!!token) {
      await secureStorage.setItem('FCM_TOKEN', token);
    }
    return token;
  } catch (error) {
    console.log('error during generating token', error);
  }
};

export async function requestUserPermission() {
  try {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return;

    const authStatus = await requestPermission(messagingInstance);
    console.log('authStatus', authStatus);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken(messagingInstance);
    }
  } catch (error) {
    console.warn('[notifciationService] requestUserPermission failed:', (error as Error).message);
  }
}