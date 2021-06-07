import { combineReducers } from 'redux';
import uiReducer from './ui';
import modalReducer from './modal';
import auth from './authReducer';
import errorReducer from './errorReducer';
import mqtts from './mqtt';
import devices from './device';

import customers from './customer';
import images from './image';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  ui: uiReducer,
  modal: modalReducer,
  form: formReducer,
  auth,
  error: errorReducer,
  mqtts,
  devices,
  customers,
  images,
});

export default rootReducer;
