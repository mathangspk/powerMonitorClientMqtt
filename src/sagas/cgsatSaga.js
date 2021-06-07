import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllCgsatsSuccess,
  listAllCgsatsFail,
  searchCgsatSuccess,
  searchCgsatFail,
  getIdCgsatSuccess,
  getIdCgsatFail,
  addCgsatSuccess,
  addCgsatFail,
  deleteCgsatSuccess,
  deleteCgsatFail,
  updateCgsatSuccess,
  updateCgsatFail,
} from '../actions/cgsatActions';

import { getAllCgsat, searchCgsat, getIdCgsat, addCgsatRequest, deleteCgsatRequest, patchCgsatRequest } from '../apis/cgsat';
import { getToken } from '../apis/auth';

import * as cgsatTypes from '../constants/cgsat';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllCgsatSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllCgsat, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllCgsatsSuccess(data))
  } else {
    yield put(listAllCgsatsFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_CGSATS_FAIL'))
  }
  yield put(hideLoading());
}

function* searchCgsatSaga({ payload }) {
  console.log("search")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchCgsat, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchCgsatSuccess(data, payload))
  } else {
    yield put(searchCgsatFail(data))
    yield put(returnErrors(data, status, 'SEARCH_CGSAT_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdCgsatSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdCgsat, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdCgsatSuccess(data))
  } else {
    yield put(getIdCgsatFail(data))
    yield put(returnErrors(data, status, 'GET_ID_CGSAT_FAIL'))
  }
  yield put(hideLoading());
}

function* addCgsatSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addCgsatRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/cgsat-detail/' + data._id
    // yield put(addCgsatSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addCgsatFail(data));
    yield put(returnErrors(data, status, 'ADD_CGSAT_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteCgsatSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteCgsatRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchCgsat, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchCgsatSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteCgsatFail(data));
  }
  yield put(hideLoading());
}

function* updateCgsatSaga({ payload }) {
  const token = yield call(getToken);
  const cgsatEdited = payload;
  const cgsatEditting = yield select((state) => state.cgsats.cgsat);
  console.log(cgsatEdited)
  const { _id } = cgsatEditting;
  const cgsatSendReducer = { _id, ...cgsatEdited }
  yield put(showLoading());
  const resp = yield call(
    patchCgsatRequest,
    token, _id, cgsatEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateCgsatSuccess(cgsatSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateCgsatFail(data));
  }
  yield put(hideLoading());
}

function* cgsatSaga() {
  yield takeLatest(cgsatTypes.GET_ALL_CGSATS, getAllCgsatSaga);
  yield takeLatest(cgsatTypes.SEARCH_CGSAT, searchCgsatSaga);
  yield takeLatest(cgsatTypes.GET_ID_CGSAT, getIdCgsatSaga);
  yield takeLatest(cgsatTypes.ADD_CGSAT, addCgsatSaga);
  yield takeLatest(cgsatTypes.DELETE_CGSAT, deleteCgsatSaga);
  yield takeLatest(cgsatTypes.UPDATE_CGSAT, updateCgsatSaga);
}

export default (cgsatSaga);
