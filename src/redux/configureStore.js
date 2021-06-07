import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
//IMPORT SAGA
import mqttSaga from '../sagas/mqttSaga';
import deviceSaga from '../sagas/deviceSaga';
import login from '../sagas/login';
import customerSaga from '../sagas/customerSaga';

const composeEnhancers =
  process.env.NODE_ENV !== 'toolion' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      shouldHotReload: false,
    })
    : compose;
const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const middlewares = [thunk, sagaMiddleware];
  const enhancers = [applyMiddleware(...middlewares)];
  const store = createStore(rootReducer, composeEnhancers(...enhancers));

  sagaMiddleware.run(login);
  sagaMiddleware.run(mqttSaga);
  sagaMiddleware.run(deviceSaga);
  sagaMiddleware.run(customerSaga);
  
  return store;
};
export default configureStore;
