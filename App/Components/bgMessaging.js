// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
  // handle your message
  // const notification = new firebase.notifications.Notification();
  // notification.android.setPriority(firebase.notifications.Android.Priority.High);
  // notification.setSound('default');
  // notification.android.setChannelId("test-channel");
  // notification.setTitle(message.data.custom1);
  //
  // firebase.notifications().displayNotification(notification);
  //
  // // Set up your listener
  // firebase.notifications().onNotificationOpened((notificationOpen) => {
  //   // notificationOpen.action will equal 'test_action'
  // });

// Set up your listener
  firebase.notifications().onNotificationOpened((notificationOpen) => {
    console.log('day la trong bgMessageing');
    // notificationOpen.action will equal 'snooze'
  });

// Build your notification
  const notification = new firebase.notifications.Notification()
    .setTitle('Android Notification Actions')
    .setBody('Action Body')
    .setNotificationId('notification-action')
    .setSound('default')
    .android.setChannelId('notification-action')
    .android.setPriority(firebase.notifications.Android.Priority.Max);
// Build an action
  const action = new firebase.notifications.Android.Action('snooze', 'ic_launcher', 'My Test Action');
// This is the important line
  action.setShowUserInterface(false);
// Add the action to the notification
  notification.android.addAction(action);

// Display the notification
  firebase.notifications().displayNotification(notification);

  return Promise.resolve();
}
