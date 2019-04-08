import React, { Component } from 'react'
import { View, StatusBar, PermissionsAndroid } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';
// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  constructor (props) {
    super(props)
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('co quyen',firebase)
        } else {
          console.log('khong co quyen')
          firebase.messaging().requestPermission()
            .then(() => {
              console.log('xin duoc quyen')
            })
            .catch(error => {
              console.log('khong xin co quyen ')
              // User has rejected permissions
            });
        }
      });

    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          console.log('co fcmToken',fcmToken)
        } else {
          // user doesn't have a device token yet
          console.log('khong co fcmToken')
        }
      });
  }
  async componentDidMount() {
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.log('notificationOpen',notificationOpen)
      const action = notificationOpen.action;
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      alert(JSON.stringify(notification.data, function(key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }));
    }
    // const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    //   .setDescription('My apps test channel');
    //  // Create the channel
    // firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      console.log('notificationDisplayedListener',notification)
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });

    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      console.log('Notification',notification)

      notification
        .setSound('default')
        .android.setChannelId('test-channel')
        .android.setSmallIcon('ic_launcher')
        .android.setPriority(firebase.notifications.Android.Priority.Max);
      // Build an action
      const action = new firebase.notifications.Android.Action('snooze', 'ic_launcher', 'My Test Action');
      // This is the important line
      action.setShowUserInterface(false);
      // Add the action to the notification
      notification.android.addAction(action);
      firebase.notifications()
        .displayNotification(notification);

    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      console.log('notificationOpenedListener',notificationOpen)
      alert(JSON.stringify(notification.data, function(key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }));
      firebase.notifications().removeDeliveredNotification(notification.notificationId);
    });

    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
