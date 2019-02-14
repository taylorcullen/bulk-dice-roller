import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['navigation'],
  debug: true,
};

const middlewares = [ReduxPromise, ReduxThunk];

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  undefined,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export const persistor = persistStore(store);