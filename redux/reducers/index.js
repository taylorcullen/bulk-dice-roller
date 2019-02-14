import { combineReducers } from 'redux';
import Dice from '../reducers/reducer-dice';
// Import Reducers

const appReducer = combineReducers({
  dice: Dice
});

const rootReducer = (state, action) => {
  // do ifs for ations

  return appReducer(state, action);
};

export default rootReducer;