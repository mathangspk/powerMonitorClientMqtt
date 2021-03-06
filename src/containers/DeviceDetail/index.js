import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as mqttActions from '../../actions/mqttActions';
import * as deviceActions from '../../actions/deviceActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import MqttForm from '../DeviceForm';
import { Grid, withStyles, Fab, TextField, Button, FormControl, InputLabel,Select } from '@material-ui/core';
import { Edit, FastfoodOutlined, Visibility } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';
import BarChart from '../../components/BarChart';

class DeviceDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        page: 1,
        rowPerPage: 20,
        rowPerPageOption: [10, 20, 50, 100, 200, 500, 1000, 10000]
      },

      redirect: false,
      idRedirect: '',
      dataSearch: {
      },
      dataPowerSearch: {
        status:"max"
      },
      showBarOnTime: false,
      showBarOnDaily: false,
      analysic: {},
      columnsGrid: [
        //{ selector: 'topic', name: 'Topic', width: '200px', sortable: true, center: true },
        { selector: '_id', name: 'Time', width: '200px', sortable: true, cell: (params) => moment(params._id).format('DD/MM/YYYY HH:mm:ss') },
        { selector: 'topic', name: 'Serial Number', width: '200px', sortable: true, center: true },
        { selector: 'volt', name: 'Volt', width: '120px', sortable: true, center: true, },
        { selector: 'power', name: 'Power', width: '120px', sortable: true, center: true },
        { selector: 'current', name: 'Current', width: '120px', sortable: true, center: true },
        { selector: 'energy', name: 'Total', width: '120px', sortable: true },
        { selector: 'frequency', name: 'Frequency', width: '120px', sortable: true },
        { selector: 'powerfactor', name: 'PF', width: '120px', sortable: true },

      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/mqtt-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { deviceActionCreator, mqttActionCreator, match: { params }, device } = this.props;
    const { getIdDevice } = deviceActionCreator;
    getIdDevice(params.deviceId);

  }

  componentDidUpdate(prevProps) {
    const { device, mqttActionCreator, analysic } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchMqtt } = mqttActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    // Typical usage (don't forget to compare props):
    if (device !== prevProps.device) {
      //      console.log(device)
      this.setState({
        topic: device.sn
      })
      params = {
        ...params,
        topic: device.sn,
        from: new Date(),
        to: new Date(),
        skip: (pagination.page - 1) * pagination.rowPerPage,
        limit: pagination.rowPerPage
      }
      searchMqtt(params);
    }
    if (analysic !== prevProps.analysic) {
      this.setState({
        analysic
      })

    }
  }

  onClickDelete = (mqtt) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== mqtt.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "B???n mu???n x??a Phi???u thay ?????i GSAT n??y?",
      ifOk: () => {
        const { mqttActionCreator } = self.props;
        const { deleteMqtt } = mqttActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteMqtt(mqtt, params);
      }
    })
  }
  onClickView = (idRedirect) => {
    this.setState({
      redirect: true,
      idRedirect
    })
  };
  onCloseWo = (data) => {
    const { mqttActionCreator, user } = this.props;
    const { updateMqtt } = mqttActionCreator;
    const newMqtt = JSON.parse(JSON.stringify(data));
    switch (newMqtt.status) {
      case 'COMPLETE':
        if (user.pkt) {
          newMqtt.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateMqtt(newMqtt);
  };
  onClickEdit = (data) => {
    const { mqttActionCreator, modalActionsCreator, user } = this.props;
    const { setMqttEditing } = mqttActionCreator;
    if (!user.admin && user._id !== data.userId._id) return;
    setMqttEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('S???a Phi???u ?????i GSAT');
    changeModalContent(<MqttForm />);
  }
  handleSearch = (event) => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch, topic } = this.state;
    const { searchMqtt } = mqttActionCreator;
    let search = {
      ...dataSearch,
      topic,
      skip: 0,
      //limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    console.log(dataSearch)
    this.setState({ dataSearch: search });
    //searchMqtt(search);
  }
  handlePowerSearch = (event) => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataPowerSearch, topic } = this.state;
    const { searchMqtt } = mqttActionCreator;
    let search = {
      ...dataPowerSearch,
      topic,
      skip: 0,
      //limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    console.log(search)
    this.setState({ dataPowerSearch: search });
    //searchMqtt(search);
  }
  searchData = () => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch, topic } = this.state;
    const { searchMqtt } = mqttActionCreator;
    let search = {
      ...dataSearch,
      topic,
      skip: 0,
      //limit: pagination.rowPerPage,
    }
    this.setState({
      showBarOnTime:true,
      showBarOnDaily: false,
    })
    console.log(dataSearch)
    searchMqtt(search);
  }
  searchPowerData = () => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataPowerSearch, topic } = this.state;
    const { searchPowerMqtt  } = mqttActionCreator;
    let search = {
      ...dataPowerSearch,
      topic,
      skip: 0,
      //limit: pagination.rowPerPage,
    }
    searchPowerMqtt(search);
  }
  handleChangePage = (page, total) => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch, topic } = this.state;
    const { searchMqtt } = mqttActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      topic,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchMqtt(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchMqtt } = mqttActionCreator;
    pagination.rowPerPage = rowPerPage;
    pagination.page = 1;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchMqtt(params);
  }

  render() {
    const { mqtts, mqttsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch, analysic, dataPowerSearch, showBarOnDaily, showBarOnTime } = this.state;
    this.calPercentPowerGreater(mqtts)
    return (

      <Fragment>

        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_time_from"
                name="from"
                label="From"
                variant="filled"
                type="datetime-local"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_time_to"
                name="to"
                label="To"
                variant="filled"
                type="datetime-local"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration (minute)"
                variant="filled"
                type="text"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search ">
              <Button className="buttonFind" onClick={() => this.searchData()}>T??m</Button>
            </div>
          </div>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_date_from"
                name="search_date_from"
                label="From"
                variant="filled"
                type="date"
                onInput={this.handlePowerSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_date_to"
                name="search_date_to"
                label="To"
                variant="filled"
                type="date"
                onInput={this.handlePowerSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_time_from"
                name="search_time_from"
                label="From"
                variant="filled"
                type="time"
                onInput={this.handlePowerSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_time_to"
                name="search_time_to"
                label="To"
                variant="filled"
                type="time"
                onInput={this.handlePowerSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration (minute)"
                variant="filled"
                type="text"
                onInput={this.handlePowerSearch}
              />
            </div>
            <div className="field-search">
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="status">Power</InputLabel>
                <Select
                  fullWidth
                  native
                  value={dataPowerSearch.status}
                  onChange={this.handlePowerSearch}
                  inputProps={{
                    name: 'status',
                    id: 'status',
                  }}
                >
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                </Select>
              </FormControl>
            </div>
            <div className="field-search ">
              <Button className="buttonFind" onClick={() => this.searchPowerData()}>T??m</Button>
            </div>
          </div>
          <div className="box-search">
            <div className="lb-search">Tracking Power:</div>
            <div className="field-show">
              Max Voltage: {analysic.maxVolt} V
            </div>
            <div className="field-show">
              Min Voltage: {analysic.minVolt} V
            </div>
            <div className="field-show">
              Max Current: {analysic.maxCurrent} A
            </div>
            <div className="field-show">
              Min Current: {analysic.minCurrent} A
            </div>
            <div className="field-show">
              Max Power: {analysic.maxPower} Kwh
            </div>

            <div className="field-show">
              Min Power: {analysic.minPower} Kwh
            </div>
            <div className="field-show">
              Total Energy: {analysic.totalEnergy} kw
            </div>
          </div>
          {/* <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genData(mqtts)}
              striped={true}
              pagination
              paginationServer
              //paginationDefaultPage={pagination.page}
              //paginationPerPage={pagination.rowPerPage}
              //paginationRowsPerPageOptions={pagination.rowPerPageOption}
              //paginationTotalRows={mqttsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid> */}
          {this.renderRedirect()}
        </div>
        {showBarOnTime ? <BarChart data={this.genData(mqtts)} /> : <></>}
      </Fragment >
    );
  }
  genData = (mqtts) => {
    let { user } = this.props;
    console.log(mqtts)
    if (!user) return [];
    return mqtts.filter(mqtt => mqtt._id)
  }
  calPercentPowerGreater = (mqtts) => {
    console.log(mqtts.length)

  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    mqtts: state.mqtts.mqtts,
    device: state.devices.device,
    mqttsTotal: state.mqtts.total,
    analysic: state.mqtts.analysicPower,
    user: state.auth.user,

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    mqttActionCreator: bindActionCreators(mqttActions, dispatch),
    deviceActionCreator: bindActionCreators(deviceActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(DeviceDetail);