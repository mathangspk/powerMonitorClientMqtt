import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as deviceActions from '../../actions/deviceActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import DeviceForm from '../DeviceForm';
import { Grid, withStyles, Fab, withWidth } from '@material-ui/core';
import { DeleteForever, Edit, Visibility } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { popupConfirm } from '../../actions/ui';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import { green } from '@material-ui/core/colors';
class Devices extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        page: 1,
        rowPerPage: 20,
        rowPerPageOption: [10, 20, 50, 100, 200, 500, 1000, 10000]
      },
      redirect: false,
      online: false,
      idRedirect: '',
      idOnline: '',
      dataSearch: {
        email: ''
      },
      columnsGrid: [
        {
          name: '', width: '300px', center: true,
          cell: (params) => {
            let { user } = this.props;
//            console.log(params)
//            console.log(user)
            let data = JSON.parse(JSON.stringify(params));
//            console.log(data)
            //let checkUser = (user.admin || user._id === params.userId._id);
            let checkUser = true;
//            console.log(user)
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

                    <Fab
                      color="default"
                      aria-label="Xóa WO"
                      size='small'
                      onClick={() => {
                        this.onClickDelete(data)
                      }}
                    >
                      <DeleteForever color="error" fontSize="small" />
                    </Fab>
                  &nbsp;&nbsp;

                    <Fab
                      color="default"
                      aria-label="Online Value"
                      size='small'
                      onClick={() => {
                        this.onClickOnline(data.sn)
                      }}
                    >
                      <CloudDoneIcon style={{ color: green[500] }} fontSize="small" />
                    </Fab>
                  </> : <></>
              }
            </>
          }
        },
        //{ selector: 'topic', name: 'Topic', width: '200px', sortable: true, center: true },
        { selector: 'sn', name: 'Serial number', width: '200px', sortable: true, },
        { selector: 'name', name: 'Tên thiết bị', width: '200px', sortable: true, },
      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/device-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
    if (this.state.online && this.state.idOnline) {
      let tool = '/admin/online-device/' + this.state.idOnline;
      return <Redirect to={tool} />
    }
  }
  renderOnline = () => {
    if (this.state.online && this.state.idOnline) {
      let tool = '/admin/online-device/' + this.state.idOnline;
      return <Redirect to={tool} />
    }
  }

  componentDidMount() {
    const { deviceActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchDevice } = deviceActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchDevice(params);
  }
  onClickDelete = (device) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
//    console.log(user)
//    console.log(device)
    if (!user.admin && user._id !== device.userId) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Phiếu thay đổi GSAT này?",
      ifOk: () => {
        const { deviceActionCreator } = self.props;
        const { deleteDevice } = deviceActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteDevice(device, params);
      }
    })
  }
  onClickView = (idRedirect) => {
    this.setState({
      redirect: true,
      idRedirect
    })
  };
  onClickOnline = (idOnline) => {
    this.setState({
      online: true,
      idOnline
    })
  }
  onCloseWo = (data) => {
    const { deviceActionCreator, user } = this.props;
    const { updateDevice } = deviceActionCreator;
    const newDevice = JSON.parse(JSON.stringify(data));
    switch (newDevice.status) {
      case 'COMPLETE':
        if (user.pkt) {
          newDevice.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateDevice(newDevice);
  };
  onClickEdit = (data) => {
//    console.log(data)
    const { deviceActionCreator, modalActionsCreator, user } = this.props;
    const { setDeviceEditing } = deviceActionCreator;
    if (!user.admin && user._id !== data.userId) return;
    setDeviceEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Thông tin thiết bị');
    changeModalContent(<DeviceForm />);
  }
  handleSearch = (event) => {
    const { deviceActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchDevice } = deviceActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchDevice(search);
  }
  handleChangePage = (page, total) => {
    const { deviceActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchDevice } = deviceActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchDevice(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { deviceActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchDevice } = deviceActionCreator;
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
    searchDevice(params);
  }

  render() {
    const { devices, devicesTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>

        <div className={classes.content}>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genData(devices)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={devicesTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
          {/* //{this.onClickOnline()} */}
        </div>
      </Fragment>
    );
  }
  genData = (devices) => {
    let { user } = this.props;
//    console.log(devices)
    if (!user) return [];
    return devices.filter(device => device)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    devices: state.devices.devices,
    devicesTotal: state.devices.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deviceActionCreator: bindActionCreators(deviceActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Devices);