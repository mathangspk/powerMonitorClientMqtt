import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllCchttsSuccess,
  listAllCchttsFail,
  searchCchttSuccess,
  searchCchttFail,
  getIdCchttSuccess,
  getIdCchttFail,
  addCchttSuccess,
  addCchttFail,
  deleteCchttSuccess,
  deleteCchttFail,
  updateCchttSuccess,
  updateCchttFail,
} from '../actions/cchttActions';

import { getAllCchtt, searchCchtt, getIdCchtt, addCchttRequest, deleteCchttRequest, patchCchttRequest } from '../apis/cchtt';
import { getToken } from '../apis/auth';

import * as cchttTypes from '../constants/cchtt';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllCchttSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllCchtt, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllCchttsSuccess(data))
  } else {
    yield put(listAllCchttsFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_CCHTTS_FAIL'))
  }
  yield put(hideLoading());
}

function* searchCchttSaga({ payload }) {
  console.log("search")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchCchtt, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchCchttSuccess(data, payload))
  } else {
    yield put(searchCchttFail(data))
    yield put(returnErrors(data, status, 'SEARCH_CCHTT_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdCchttSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdCchtt, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdCchttSuccess(data))
  } else {
    yield put(getIdCchttFail(data))
    yield put(returnErrors(data, status, 'GET_ID_CCHTT_FAIL'))
  }
  yield put(hideLoading());
}

function* addCchttSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addCchttRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/cchtt-detail/' + data._id
    // yield put(addCchttSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addCchttFail(data));
    yield put(returnErrors(data, status, 'ADD_CCHTT_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteCchttSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteCchttRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchCchtt, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchCchttSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteCchttFail(data));
  }
  yield put(hideLoading());
}

function* updateCchttSaga({ payload }) {
  const token = yield call(getToken);
  const cchttEdited = payload;
  const cchttEditting = yield select((state) => state.cchtts.cchtt);
  console.log(cchttEdited)
  const { _id } = cchttEditting;
  const cchttSendReducer = { _id, ...cchttEdited }
  yield put(showLoading());
  const resp = yield call(
    patchCchttRequest,
    token, _id, cchttEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateCchttSuccess(cchttSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateCchttFail(data));
  }
  yield put(hideLoading());
}

function* cchttSaga() {
  yield takeLatest(cchttTypes.GET_ALL_CCHTTS, getAllCchttSaga);
  yield takeLatest(cchttTypes.SEARCH_CCHTT, searchCchttSaga);
  yield takeLatest(cchttTypes.GET_ID_CCHTT, getIdCchttSaga);
  yield takeLatest(cchttTypes.ADD_CCHTT, addCchttSaga);
  yield takeLatest(cchttTypes.DELETE_CCHTT, deleteCchttSaga);
  yield takeLatest(cchttTypes.UPDATE_CCHTT, updateCchttSaga);
}

export default (cchttSaga);
