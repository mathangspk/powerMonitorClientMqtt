import * as mqttConstants from '../constants/mqtt';

export const listAllMqtts = (params = {}) => {
  return {
    type: mqttConstants.GET_ALL_MQTT,
    payload: {
      params,
    }
  }
}
export const listAllMqttsSuccess = (data) => {
  return {
    type: mqttConstants.GET_ALL_MQTT_SUCCESS,
    payload: data,
  }
}
export const listAllMqttsFail = (error) => {
  return {
    type: mqttConstants.GET_ALL_MQTT_FAIL,
    payload: {
      error,
    }
  }
}
export const searchMqtt = (params = {}) => {
  return {
    type: mqttConstants.SEARCH_MQTT,
    payload: {
      params,
    }
  }
}
export const getPowerDaily = (params = {}) => {
  return {
    type: mqttConstants.GET_POWER_DAILY_MQTT,
    payload: {
      params,
    }
  }
}
export const searchMqttSuccess = (data, params) => {
  return {
    type: mqttConstants.SEARCH_MQTT_SUCCESS,
    payload: { data, params }
  }
}
export const searchMqttFail = (error) => {
  return {
    type: mqttConstants.SEARCH_MQTT_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdMqtt = (payload) => {
  return {
    type: mqttConstants.GET_ID_MQTT,
    payload
  }
}
export const getIdMqttSuccess = (payload) => {
  return {
    type: mqttConstants.GET_ID_MQTT_SUCCESS,
    payload
  }
}
export const getIdMqttFail = (payload) => {
  return {
    type: mqttConstants.GET_ID_MQTT_FAIL,
    payload
  }
}
export const addMqtt = (payload) => {
  return {
    type: mqttConstants.ADD_MQTT,
    payload,
  };
};

export const addMqttSuccess = (payload) => {
  return {
    type: mqttConstants.ADD_MQTT_SUCCESS,
    payload,
  };
};

export const addMqttFail = (payload) => {
  return {
    type: mqttConstants.ADD_MQTT_FAIL,
    payload,
  };
};

export const deleteMqtt = (payload, params) => {
  return {
    type: mqttConstants.DELETE_MQTT,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteMqttSuccess = (payload) => {
  return {
    type: mqttConstants.DELETE_MQTT_SUCCESS,
    payload,
  };
};

export const deleteMqttFail = (payload) => {
  return {
    type: mqttConstants.DELETE_MQTT_FAIL,
    payload,
  };
};

export const updateMqtt = (payload) => {
  return {
    type: mqttConstants.UPDATE_MQTT,
    payload,
  };
};

export const updateMqttSuccess = (payload) => {
  return {
    type: mqttConstants.UPDATE_MQTT_SUCCESS,
    payload,
  };
};

export const updateMqttNote = (payload) => {
  return {
    type: mqttConstants.UPDATE_MQTT_NOTE,
    payload,
  };
};

export const updateMqttFail = (payload) => {
  return {
    type: mqttConstants.UPDATE_MQTT_FAIL,
    payload,
  };
};


export const setMqttEditing = (mqtt) => ({
  type: mqttConstants.SET_MQTT_EDITING,
  payload: {
    mqtt,
  },
});