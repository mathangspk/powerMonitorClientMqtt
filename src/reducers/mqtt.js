import * as types from '../constants/mqtt';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    mqtts: [],
    loading: false,
    isCreateSuccess: false,
    mqttEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_MQTT_SUCCESS:
            return {
                ...state,
                mqtts: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                analysicPower: action.payload.Status.StatusCode === 200 && action.payload.Data.analysicPower || [],
                loading: false
            }
        case types.GET_POWER_DAILY_MQTT:
            return {
                ...state,
                loading: true
            }
        case types.SEARCH_POWER_MQTT:
            return {
                ...state,
                loading: true
            }
        case types.SEARCH_MQTT_SUCCESS:
            return {

                ...state,
                mqtts: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                analysicPower: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.analysic || [],
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_MQTT_SUCCESS:
            return {
                ...state,
                mqtt: action.payload,
                loading: false
            }
        case types.ADD_MQTT:
            return {
                ...state,
            }
        case types.ADD_MQTT_SUCCESS: {
            const data = action.payload;
            toastSuccess('Thêm mới Work Mqtt thành công!')
            return {
                ...state,
                mqtts: [data, ...state.mqtts],
            };
        }
        case types.ADD_MQTT_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_MQTT_SUCCESS:
            return {
                ...state,
                mqtts: [...state.mqtts.filter(mqtt => mqtt._id !== action.payload)]
            }
        case types.SET_MQTT_EDITING: {
            const { mqtt } = action.payload;
            return {
                ...state,
                mqtt,
            };
        }
        case types.UPDATE_MQTT: {
            return {
                ...state,
            };
        }
        case types.UPDATE_MQTT_NOTE: {
            const mqttEditting = action.payload;
            return {
                ...state,
                mqtt: mqttEditting
            };
        }
        case types.UPDATE_MQTT_SUCCESS: {
            const mqttEditting = action.payload;
            const { mqtts } = state;
            const index = mqtts.findIndex((item) => item._id === mqttEditting._id);
            if (index !== -1) {
                const newList = [
                    ...mqtts.slice(0, index),
                    mqttEditting,
                    ...mqtts.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    mqtts: newList,
                    mqtt: mqttEditting
                };
            }
            return { ...state, mqtt: mqttEditting }
        }
        case types.UPDATE_MQTT_FAIL: {
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