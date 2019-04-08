import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import bgActions from './bgActions';

AppRegistry.registerComponent('PizzaApp', () => App)
// New task registration
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgActions); // <-- Add this line
