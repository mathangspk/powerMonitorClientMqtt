import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllDevice = (token, data) => {
    return getWithToken('api/devices', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchDevice = (token, data) => {
    return getWithToken('api/devices/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdDevice = (token, id) => {
    return getWithToken('api/devices/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addDeviceRequest = (token, data) => {
    return postWithToken('api/devices', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteDeviceRequest = (token, id) => {
    return deleteWithToken('api/devices', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchDeviceRequest = (token, id, deviceEditting) => {
    return patchWithToken('api/devices', token, id, deviceEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




