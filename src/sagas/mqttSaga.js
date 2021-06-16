import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllMqttsSuccess,
  listAllMqttsFail,
  searchMqttSuccess,
  searchMqttFail,
  getIdMqttSuccess,
  getIdMqttFail,
  addMqttSuccess,
  addMqttFail,
  deleteMqttSuccess,
  deleteMqttFail,
  updateMqttSuccess,
  updateMqttFail,
} from '../actions/mqttActions';

import { getAllMqtt, searchMqtt, getIdMqtt, addMqttRequest, deleteMqttRequest, patchMqttRequest, getPowerDaily, searchPowerMqtt  } from '../apis/mqtt';
import { getToken } from '../apis/auth';

import * as mqttTypes from '../constants/mqtt';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllMqttSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllMqtt, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllMqttsSuccess(data))
  } else {
    yield put(listAllMqttsFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_MQTTS_FAIL'))
  }
  yield put(hideLoading());
}

function* searchMqttSaga({ payload }) {
  console.log("search")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchMqtt, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchMqttSuccess(data, payload))
  } else {
    yield put(searchMqttFail(data))
    yield put(returnErrors(data, status, 'SEARCH_MQTT_FAIL'))
  }
  yield put(hideLoading());
}
function* powerDailyMqttSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getPowerDaily, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchMqttSuccess(data, payload))
  } else {
    yield put(searchMqttFail(data))
    yield put(returnErrors(data, status, 'SEARCH_MQTT_FAIL'))
  }
  yield put(hideLoading());
}
function* searchPowerDataMqttSaga({ payload }) {
  console.log("powerData")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchPowerMqtt, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchMqttSuccess(data, payload))
  } else {
    yield put(searchMqttFail(data))
    yield put(returnErrors(data, status, 'SEARCH_MQTT_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdMqttSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdMqtt, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdMqttSuccess(data))
  } else {
    yield put(getIdMqttFail(data))
    yield put(returnErrors(data, status, 'GET_ID_MQTT_FAIL'))
  }
  yield put(hideLoading());
}

function* addMqttSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addMqttRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/mqtt-detail/' + data._id
    // yield put(addMqttSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addMqttFail(data));
    yield put(returnErrors(data, status, 'ADD_MQTT_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteMqttSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteMqttRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchMqtt, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchMqttSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteMqttFail(data));
  }
  yield put(hideLoading());
}

function* updateMqttSaga({ payload }) {
  const token = yield call(getToken);
  const mqttEdited = payload;
  const mqttEditting = yield select((state) => state.mqtts.mqtt);
  console.log(mqttEdited)
  const { _id } = mqttEditting;
  const mqttSendReducer = { _id, ...mqttEdited }
  yield put(showLoading());
  const resp = yield call(
    patchMqttRequest,
    token, _id, mqttEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateMqttSuccess(mqttSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateMqttFail(data));
  }
  yield put(hideLoading());
}

function* mqttSaga() {
  yield takeLatest(mqttTypes.GET_ALL_MQTT, getAllMqttSaga);
  yield takeLatest(mqttTypes.SEARCH_MQTT, searchMqttSaga);
  yield takeLatest(mqttTypes.SEARCH_POWER_MQTT, searchPowerDataMqttSaga);
  yield takeLatest(mqttTypes.GET_POWER_DAILY_MQTT , powerDailyMqttSaga);
  yield takeLatest(mqttTypes.GET_ID_MQTT, getIdMqttSaga);
  yield takeLatest(mqttTypes.ADD_MQTT, addMqttSaga);
  yield takeLatest(mqttTypes.DELETE_MQTT, deleteMqttSaga);
  yield takeLatest(mqttTypes.UPDATE_MQTT, updateMqttSaga);
}

export default (mqttSaga);
