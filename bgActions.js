// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
  // handle your message
  const notification = new firebase.notifications.Notification();
  notification.android.setPriority(firebase.notifications.Android.Priority.High);
  notification.setSound('default');
  // notification.setBody('Action Body');
  notification.android.setChannelId("test-channel");
  // notification.setTitle('aa.custom1');

  firebase.notifications().displayNotification(notification);

  // Set up your listener
  firebase.notifications().onNotificationOpened((notificationOpen) => {
    // notificationOpen.action will equal 'test_action'
  });


  return Promise.resolve();
}
