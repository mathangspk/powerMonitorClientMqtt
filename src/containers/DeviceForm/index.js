import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControl, InputLabel, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as deviceActions from '../../actions/deviceActions';

import * as customerActions from '../../actions/customerActions';
import Alert from '@material-ui/lab/Alert';
import * as modalActions from '../../actions/modal';
import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import moment from 'moment';
import { ConsoleWriter } from 'istanbul-lib-report';

class DeviceForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSearch: true,
      openSelectCustomer: false,
      nameCustomer: '',
      userIdSelect: '',
      msgError: ''
    }
  }

  //@check login success adn error
  componentDidUpdate(nextprops) {
    const { msgError } = this.props;
    if (msgError !== nextprops.msgError) {
      this.setState({
        msgError
      })
    }
  }
  componentDidMount() {
    const { customerActionCreator, deviceEditting } = this.props;
    console.log(deviceEditting)
    const { listAllCustomers } = customerActionCreator;
    if (deviceEditting) {
      this.setState({
        sn: deviceEditting.sn
      })
    } else {
      this.setState({
        sn: genRandom(7)
      })
    }
    listAllCustomers();
  }
  handleSubmitForm = (data) => {
    const { deviceActionsCreator, deviceEditting, user } = this.props;
    const { addDevice, updateDevice } = deviceActionsCreator;
    console.log(data)
    var { sn } = this.state;
    const newDevice = {
      ...(deviceEditting || {}),
      userId: user._id,
      sn,
      name: data.name
    }
    console.log(user)
    console.log(newDevice)
    if (deviceEditting) {
      // newDevice.PCT = deviceEditting.PCT
      // newDevice.WO = deviceEditting.WO
      newDevice.userId = deviceEditting.userId
      // newDevice.timeChange = deviceEditting.timeChange
      // newDevice.note = deviceEditting.note
      if (user.admin || newDevice.userId === user._id) {
        updateDevice(newDevice);
      }
    } else {
      addDevice(newDevice);
    }
  };

  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  renderdeviceFail = () => {
    const { msgError } = this.state;
    console.log(msgError);
    let xhtml = null;
    xhtml = msgError ? (<Alert variant="standard" severity="error">
      {msgError}
    </Alert>) : null
    return xhtml;
  }

  render() {
    var {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting,

      initialValues
    } = this.props;
    var { sn } = this.state;

    const { hideModal } = modalActionsCreator;
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container className={classes.form}>

          <Grid item md={12}>
            <p>Serial Number: {sn}</p>
            <p></p>
            <p>Quý khách vui lòng lưu lại Serial Number này để cấu hình thiết bị ở bước tiếp theo</p>
          </Grid>
          <Grid item md={12}>
            <Field
              id="name"
              name="name"
              label="Tên thiết bị"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            />
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            {this.renderdeviceFail()}
            <Button onClick={hideModal}>Hủy</Button>
            <Button disabled={invalid || submitting} type="submit">
              Lưu
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}
function genRandom(numBytes) {
  let i = 0;
  let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let randString = "";
  for (i = 0; i < numBytes; i++) {
    randString = randString + random_item(letters);
  }
  return randString;
}
function random_item(items) {

  return items[Math.floor(Math.random() * items.length)];

}
DeviceForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    deviceEditting: state.devices.device,
    initialValues: {
      sn: state.devices.device ? state.devices.device.sn : null,
      name: state.devices.device ? state.devices.device.name : null,
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg
  };
};



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deviceActionsCreator: bindActionCreators(deviceActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'device_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(DeviceForm);
