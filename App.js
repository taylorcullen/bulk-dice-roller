import React from 'react';
import { store, persistor } from './src/redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Font, AppLoading } from 'expo';
import BulkRoller from './src/screens/BulkRoller';

// This is used in order to see requests on the Chrome DevTools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;

// App debug settings
console.disableYellowBox = true;


export default class App extends React.Component {

  state = {
    fontLoaded: false
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({fontLoaded: true});
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {!this.state.fontLoaded ? <AppLoading/> : <BulkRoller/>}
        </PersistGate>
      </Provider>
    );
  }
}