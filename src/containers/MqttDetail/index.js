import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as mqttActions from '../../actions/mqttActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, TextField, FormControl, Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import {ArrowBackIos, Edit } from '@material-ui/icons';
import MqttForm from '../DeviceForm';
import moment from 'moment';

import "react-image-gallery/styles/css/image-gallery.css";


class MqttDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      mqttAction: true,
    }
  }

  componentDidMount() {
    const { mqttActionCreator, customerActionCreator, match: { params }, mqtt } = this.props;
    const { getIdMqtt } = mqttActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdMqtt(params.mqttId);
    listAllCustomers();
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickAddTool = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickGotoList = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickEdit = (data) => {
    const { mqttActionCreator, modalActionsCreator } = this.props;
    const { setMqttEditing } = mqttActionCreator;
    setMqttEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Biên Bản ĐGKT');
    changeModalContent(<MqttForm />);
  }
  onChangeNote = (event) => {
    const { mqttActionCreator, mqtt } = this.props;
    const { updateMqttNote } = mqttActionCreator;
    const newMqtt = JSON.parse(JSON.stringify(mqtt));
    newMqtt.note = event.target.value;
    this.setState({ isChange: true });
    updateMqttNote(newMqtt);
  }
  onBlurNote = (event) => {
    const { mqttActionCreator, mqtt } = this.props;
    const { isChange } = this.state;
    const newMqtt = JSON.parse(JSON.stringify(mqtt));
    if (isChange) {
      const { updateMqtt } = mqttActionCreator;
      newMqtt.note = event.target.value;
      updateMqtt(newMqtt);
      this.setState({ isChange: false });
    }
  }
  render() {
    const { classes, mqtt, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, mqttAction } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={mqtt._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/mqtt') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={mqtt.userId && (user.admin || user._id === mqtt.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(mqtt) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                </div>
                {mqtt.userId && user._id !== mqtt.userId._id ? <div className='customer-field'>Người dùng: {mqtt.userId ? mqtt.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="mqtt" value={mqtt.MQTT} label="Số Biên Bản ĐGKT" InputProps={{ readOnly: true }} />
                    </FormControl>


                    <FormControl className='field' fullWidth>
                      <TextField id="content" value={mqtt.content} label="Nội dung công tác" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={mqtt.WO} label="Work Mqtt" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="time" value={moment(mqtt.time).format('DD/MM/YYYY')} label="Ngày thực hiện" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={mqtt.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    mqtts: state.mqtts.mqtts,
    mqtt: {
      WO: state.mqtts.mqtt ? state.mqtts.mqtt.WO : '',
      content: state.mqtts.mqtt ? state.mqtts.mqtt.content : '',
      MQTT: state.mqtts.mqtt ? state.mqtts.mqtt.MQTT : '',
      time: state.mqtts.mqtt ? state.mqtts.mqtt.time : '',
      userId: state.mqtts.mqtt ? state.mqtts.mqtt.userId : {},
      note: state.mqtts.mqtt ? state.mqtts.mqtt.note : '',
      _id: state.mqtts.mqtt ? state.mqtts.mqtt._id : '',
      isAction: true
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

    mqttActionCreator: bindActionCreators(mqttActions, dispatch),
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(MqttDetail);