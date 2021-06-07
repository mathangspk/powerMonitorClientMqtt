import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllMqtt = (token, data) => {
    return getWithToken('api/mqtts', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchMqtt = (token, data) => {
    return getWithToken('api/mqtts/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdMqtt = (token, id) => {
    return getWithToken('api/mqtts/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addMqttRequest = (token, data) => {
    return postWithToken('api/mqtts', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteMqttRequest = (token, id) => {
    return deleteWithToken('api/mqtts', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchMqttRequest = (token, id, mqttEditting) => {
    return patchWithToken('api/mqtts', token, id, mqttEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




