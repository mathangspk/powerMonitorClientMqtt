import * as deviceConstants from '../constants/device';

export const listAllDevices = (params = {}) => {
  return {
    type: deviceConstants.GET_ALL_DEVICE,
    payload: {
      params,
    }
  }
}
export const listAllDevicesSuccess = (data) => {
  return {
    type: deviceConstants.GET_ALL_DEVICE_SUCCESS,
    payload: data,
  }
}
export const listAllDevicesFail = (error) => {
  return {
    type: deviceConstants.GET_ALL_DEVICE_FAIL,
    payload: {
      error,
    }
  }
}
export const searchDevice = (params = {}) => {
  return {
    type: deviceConstants.SEARCH_DEVICE,
    payload: {
      params,
    }
  }
}
export const searchDeviceSuccess = (data, params) => {
  return {
    type: deviceConstants.SEARCH_DEVICE_SUCCESS,
    payload: { data, params }
  }
}
export const searchDeviceFail = (error) => {
  return {
    type: deviceConstants.SEARCH_DEVICE_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdDevice = (payload) => {
  return {
    type: deviceConstants.GET_ID_DEVICE,
    payload
  }
}
export const getIdDeviceSuccess = (payload) => {
  return {
    type: deviceConstants.GET_ID_DEVICE_SUCCESS,
    payload
  }
}
export const getIdDeviceFail = (payload) => {
  return {
    type: deviceConstants.GET_ID_DEVICE_FAIL,
    payload
  }
}
export const addDevice = (payload) => {
  return {
    type: deviceConstants.ADD_DEVICE,
    payload,
  };
};

export const addDeviceSuccess = (payload) => {
  return {
    type: deviceConstants.ADD_DEVICE_SUCCESS,
    payload,
  };
};

export const addDeviceFail = (payload) => {
  return {
    type: deviceConstants.ADD_DEVICE_FAIL,
    payload,
  };
};

export const deleteDevice = (payload, params) => {
  return {
    type: deviceConstants.DELETE_DEVICE,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteDeviceSuccess = (payload) => {
  return {
    type: deviceConstants.DELETE_DEVICE_SUCCESS,
    payload,
  };
};

export const deleteDeviceFail = (payload) => {
  return {
    type: deviceConstants.DELETE_DEVICE_FAIL,
    payload,
  };
};

export const updateDevice = (payload) => {
  return {
    type: deviceConstants.UPDATE_DEVICE,
    payload,
  };
};

export const updateDeviceSuccess = (payload) => {
  return {
    type: deviceConstants.UPDATE_DEVICE_SUCCESS,
    payload,
  };
};

export const updateDeviceNote = (payload) => {
  return {
    type: deviceConstants.UPDATE_DEVICE_NOTE,
    payload,
  };
};

export const updateDeviceFail = (payload) => {
  return {
    type: deviceConstants.UPDATE_DEVICE_FAIL,
    payload,
  };
};


export const setDeviceEditing = (device) => ({
  type: deviceConstants.SET_DEVICE_EDITING,
  payload: {
    device,
  },
});