import * as types from '../constants/device';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    devices: [],
    loading: false,
    isCreateSuccess: false,
    deviceEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_DEVICE_SUCCESS:
            return {
                ...state,
                devices: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_DEVICE_SUCCESS:
            return {
                ...state,
                devices: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_DEVICE_SUCCESS:
            return {
                ...state,
                device: action.payload,
                loading: false
            }
        case types.ADD_DEVICE:
            return {
                ...state,
            }
        case types.ADD_DEVICE_SUCCESS: {
            const  data  = action.payload;
            toastSuccess('Thêm mới Work Device thành công!')
            return {
                ...state,
                devices: [data, ...state.devices],
            };
        }
        case types.ADD_DEVICE_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_DEVICE_SUCCESS:
            return {
                ...state,
                devices: [...state.devices.filter(device => device._id !== action.payload)]
            }
        case types.SET_DEVICE_EDITING: {
            const { device } = action.payload;
            return {
                ...state,
                device,
            };
        }
        case types.UPDATE_DEVICE: {
            return {
                ...state,
            };
        }
        case types.UPDATE_DEVICE_NOTE: {
            const  deviceEditting  = action.payload;
            return {
                ...state,
                device: deviceEditting
            };
        }
        case types.UPDATE_DEVICE_SUCCESS: {
            const  deviceEditting  = action.payload;
            const { devices } = state;
            const index = devices.findIndex((item) => item._id === deviceEditting._id);
            if (index !== -1) {
                const newList = [
                    ...devices.slice(0, index),
                    deviceEditting,
                    ...devices.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    devices: newList,
                    device: deviceEditting
                };
            }
            return { ...state, device: deviceEditting }
        }
        case types.UPDATE_DEVICE_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        default: return state;
    }
}
export default myReducer;