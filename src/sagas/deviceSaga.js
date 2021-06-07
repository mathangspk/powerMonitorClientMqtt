import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllDevicesSuccess,
  listAllDevicesFail,
  searchDeviceSuccess,
  searchDeviceFail,
  getIdDeviceSuccess,
  getIdDeviceFail,
  addDeviceSuccess,
  addDeviceFail,
  deleteDeviceSuccess,
  deleteDeviceFail,
  updateDeviceSuccess,
  updateDeviceFail,
} from '../actions/deviceActions';

import { getAllDevice, searchDevice, getIdDevice, addDeviceRequest, deleteDeviceRequest, patchDeviceRequest } from '../apis/device';
import { getToken } from '../apis/auth';

import * as deviceTypes from '../constants/device';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllDeviceSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllDevice, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllDevicesSuccess(data))
  } else {
    yield put(listAllDevicesFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_DEVICES_FAIL'))
  }
  yield put(hideLoading());
}

function* searchDeviceSaga({ payload }) {
  console.log("search")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchDevice, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchDeviceSuccess(data, payload))
  } else {
    yield put(searchDeviceFail(data))
    yield put(returnErrors(data, status, 'SEARCH_DEVICE_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdDeviceSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdDevice, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdDeviceSuccess(data))
  } else {
    yield put(getIdDeviceFail(data))
    yield put(returnErrors(data, status, 'GET_ID_DEVICE_FAIL'))
  }
  yield put(hideLoading());
}

function* addDeviceSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addDeviceRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/device-detail/' + data._id
    // yield put(addDeviceSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addDeviceFail(data));
    yield put(returnErrors(data, status, 'ADD_DEVICE_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteDeviceSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteDeviceRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchDevice, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchDeviceSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteDeviceFail(data));
  }
  yield put(hideLoading());
}

function* updateDeviceSaga({ payload }) {
  const token = yield call(getToken);
  const deviceEdited = payload;
  const deviceEditting = yield select((state) => state.devices.device);
  console.log(deviceEdited)
  const { _id } = deviceEditting;
  const deviceSendReducer = { _id, ...deviceEdited }
  yield put(showLoading());
  const resp = yield call(
    patchDeviceRequest,
    token, _id, deviceEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateDeviceSuccess(deviceSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateDeviceFail(data));
  }
  yield put(hideLoading());
}

function* deviceSaga() {
  yield takeLatest(deviceTypes.GET_ALL_DEVICE, getAllDeviceSaga);
  yield takeLatest(deviceTypes.SEARCH_DEVICE, searchDeviceSaga);
  yield takeLatest(deviceTypes.GET_ID_DEVICE, getIdDeviceSaga);
  yield takeLatest(deviceTypes.ADD_DEVICE, addDeviceSaga);
  yield takeLatest(deviceTypes.DELETE_DEVICE, deleteDeviceSaga);
  yield takeLatest(deviceTypes.UPDATE_DEVICE, updateDeviceSaga);
}

export default (deviceSaga);
