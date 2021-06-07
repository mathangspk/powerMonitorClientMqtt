import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllBptcsSuccess,
  listAllBptcsFail,
  searchBptcSuccess,
  searchBptcFail,
  getIdBptcSuccess,
  getIdBptcFail,
  addBptcSuccess,
  addBptcFail,
  deleteBptcSuccess,
  deleteBptcFail,
  updateBptcSuccess,
  updateBptcFail,
} from '../actions/bptcActions';

import { getAllBptc, searchBptc, getIdBptc, addBptcRequest, deleteBptcRequest, patchBptcRequest } from '../apis/bptc';
import { getToken } from '../apis/auth';

import * as bptcTypes from '../constants/bptc';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllBptcSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllBptc, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllBptcsSuccess(data))
  } else {
    yield put(listAllBptcsFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_BPTCS_FAIL'))
  }
  yield put(hideLoading());
}

function* searchBptcSaga({ payload }) {
  console.log("search")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchBptc, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchBptcSuccess(data, payload))
  } else {
    yield put(searchBptcFail(data))
    yield put(returnErrors(data, status, 'SEARCH_BPTC_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdBptcSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdBptc, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdBptcSuccess(data))
  } else {
    yield put(getIdBptcFail(data))
    yield put(returnErrors(data, status, 'GET_ID_BPTC_FAIL'))
  }
  yield put(hideLoading());
}

function* addBptcSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addBptcRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/bptc-detail/' + data._id
    // yield put(addBptcSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addBptcFail(data));
    yield put(returnErrors(data, status, 'ADD_BPTC_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteBptcSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteBptcRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchBptc, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchBptcSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteBptcFail(data));
  }
  yield put(hideLoading());
}

function* updateBptcSaga({ payload }) {
  const token = yield call(getToken);
  const bptcEdited = payload;
  const bptcEditting = yield select((state) => state.bptcs.bptc);
  console.log(bptcEdited)
  const { _id } = bptcEditting;
  const bptcSendReducer = { _id, ...bptcEdited }
  yield put(showLoading());
  const resp = yield call(
    patchBptcRequest,
    token, _id, bptcEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateBptcSuccess(bptcSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateBptcFail(data));
  }
  yield put(hideLoading());
}

function* bptcSaga() {
  yield takeLatest(bptcTypes.GET_ALL_BPTC, getAllBptcSaga);
  yield takeLatest(bptcTypes.SEARCH_BPTC, searchBptcSaga);
  yield takeLatest(bptcTypes.GET_ID_BPTC, getIdBptcSaga);
  yield takeLatest(bptcTypes.ADD_BPTC, addBptcSaga);
  yield takeLatest(bptcTypes.DELETE_BPTC, deleteBptcSaga);
  yield takeLatest(bptcTypes.UPDATE_BPTC, updateBptcSaga);
}

export default (bptcSaga);
