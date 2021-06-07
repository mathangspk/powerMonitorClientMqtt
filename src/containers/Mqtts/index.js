import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as mqttActions from '../../actions/mqttActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import MqttForm from '../DeviceForm';
import { Grid, withStyles, Fab, TextField } from '@material-ui/core';
import { Edit, Visibility } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';
import BarChart from '../../components/BarChart';

class Mqtts extends Component {
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
        email: ''
      },
      columnsGrid: [
        {
          name: '', width: '100px', center: true,
          cell: (params) => {
            let { user } = this.props;
            console.log(params)
            console.log(user)
            let data = JSON.parse(JSON.stringify(params));
            console.log(data)
            //let checkUser = (user.admin || user._id === params.userId._id);
            let checkUser = true;
            console.log(user)
            return <>
              <Fab
                color="default"
                aria-label="Xem Chi Tiết"
                size='small'
                onClick={() => {
                  this.onClickView(data._id)
                }}
              >
                <Visibility color="primary" />
              </Fab>
              {
                checkUser ?
                  <>
                    &nbsp;&nbsp;
                    <Fab
                      color="default"
                      aria-label="Sửa WO"
                      size='small'
                      onClick={() => {
                        this.onClickEdit(data)
                      }}
                    >
                      <Edit color="primary" />
                    </Fab>
                  &nbsp;&nbsp;

                    {/* <Fab
                    color="default"
                    aria-label="Xóa WO"
                    size='small'
                    onClick={() => {
                      this.onClickDelete(data)
                    }}
                    >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab> */}
                  </> : <></>
              }
            </>
          }
        },
        //{ selector: 'topic', name: 'Topic', width: '200px', sortable: true, center: true },
        { selector: 'date', name: 'Time', width: '200px', sortable: true, cell: (params) => moment(params.date).format('DD/MM/YYYY HH:mm:ss') },
        { selector: 'localIp', name: 'Local Ip', width: '200px', sortable: true, center: true },
        { selector: 'email', name: 'Email', width: '200px', sortable: true, center: true },
        { selector: 'volt', name: 'Volt', width: '120px', sortable: true, center: true,},
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
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchMqtt } = mqttActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchMqtt(params);
  }
  onClickDelete = (mqtt) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== mqtt.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Phiếu thay đổi GSAT này?",
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
    changeModalTitle('Sửa Phiếu Đổi GSAT');
    changeModalContent(<MqttForm />);
  }
  handleSearch = (event) => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchMqtt } = mqttActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchMqtt(search);
  }
  handleChangePage = (page, total) => {
    const { mqttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchMqtt } = mqttActionCreator;
    pagination.page = page;
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
    const { mqtts,mqttsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_MQTT"
                name="mqtt"
                label="Biên bản ĐGKT"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_WO"
                name="wo"
                label="Work Order"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_content"
                name="content"
                label="Nội dung công tác"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
          </div>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genData(mqtts)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={mqttsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
        <BarChart data={this.genData(mqtts)}/>
      </Fragment>
    );
  }
  genData = (mqtts) => {
    let { user } = this.props;
    console.log(mqtts)
    if (!user) return [];
    return mqtts.filter(mqtt => mqtt)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    mqtts: state.mqtts.mqtts,
    mqttsTotal: state.mqtts.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    mqttActionCreator: bindActionCreators(mqttActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Mqtts);