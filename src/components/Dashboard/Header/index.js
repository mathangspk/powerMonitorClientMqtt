import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect, } from 'react-redux';
import { withRouter } from 'react-router';

import { withStyles, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Add, GetApp } from '@material-ui/icons';


import * as modalActions from '../../../actions/modal';
import * as customerActions from '../../../actions/customerActions';
import CustomerForm from '../../../containers/CustomerForm';
import styles from './styles';
import { Redirect } from "react-router-dom";
import { getWithToken } from '../../../commons/utils/apiCaller';
import { getToken } from '../../../apis/auth';
import XLSX from 'xlsx';
import moment from 'moment';

const menuId = 'primary-search-account-menu';
const mobileMenuId = 'primary-search-account-menu-mobile';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      redirect: false,
      urlRedirect: ''
    };
  }
  handleProfileMenuOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  handleMyProfile = () => {
    const { customerActionsCreator, modalActionsCreator, user } = this.props;
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(user);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa thông tin cá nhân');
    changeModalContent(<CustomerForm />);
  }
  handleLogout = () => {
    const { history, logout } = this.props;
    logout();
    if (history) {
      history.push('/login')
    }
  }
  openForm = () => {
    const { modalActionsCreator,
      customerActionsCreator,
      form: FormComponent,
      labelButtonAdd } = this.props;
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(null);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle(`Thêm ${labelButtonAdd}`);
    changeModalContent(<FormComponent />);
  }
  renderMenu = () => {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMyProfile}>Thông tin cá nhân</MenuItem>
        <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
      </Menu>
    );
  };

  handleToggleSidebar = () => {
    const { showSidebar, onToggleSidebar } = this.props;
    if (onToggleSidebar) {
      onToggleSidebar(!showSidebar)
    }
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickGotoUrl = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }

  convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  generateOrder = (item) => {
    return [item.PCT, item.userId.department, item.location, item.KKS, item.content, moment(item.timeStart).format('DD-MM-YYYY'), moment(item.timeStop).format('DD-MM-YYYY'), item.userId.name, item.WO]
  }
  generateCchtt = (item) => {
    return [item.PCCHTT, item.WO, item.PCT, item.userId.name, moment(item.timeChange).format('HH:mm DD-MM-YYYY'), item.note]
  }
  generateCgsat = (item) => {
    return [item.PCGSAT, item.WO, item.PCT, item.userId.name, moment(item.timeChange).format('HH:mm DD-MM-YYYY'), item.note]
  }
  generateBbdgkt = (item) => {
    return [item.BBDGKT, item.userId.department, item.content, item.WO, moment(item.time).format('DD-MM-YYYY'), item.userId.name]
  }
  generateBptc = (item) => {
    return [item.BPTC, item.JSA, item.content, item.note]
  }
  generateTool = (item) => {
    if (item.woInfo && item.woInfo.length > 0) {
      let woInfo = item.woInfo.filter(wo => wo.status !== 'COMPLETE');
      if (woInfo.length > 0) {
        item.woName = woInfo[0].WO;
        item.userName = woInfo[0].userInfo.name
      }
    }
    let status = ''
    switch (item.status) {
      case 1:
        status = 'READY'
        break;
      case 2:
        status = 'IN USE'
        break;
      case 3:
        status = 'BAD'
        break;
      case 4:
        status = 'LOST'
        break;
      default:

        status = 'READY'
        break;
    }
    return [item.name, item.manufacturer, item.type, item.woName || '', item.userName || '', status]
  }
  handleExport = async () => {
    const { labelButtonAdd, order, tools, cchtt, cgsat, bbdgkt, bptc } = this.props;
    console.log(labelButtonAdd)
    let url = '';
    let params = {};
    let header = [];
    let dataBind = '';
    let genData = null;
    let nameSheet = '';
    switch (labelButtonAdd) {
      case 'WORK ORDER':
        params = JSON.parse(JSON.stringify(order.params));
        delete params.skip;
        delete params.limit;
        header = ["Số phiếu", "PX thực hiện", "Địa điểm công tác", "Hệ thống/KKS", "Nội dung công tác", "Ngày bắt đầu", "Ngày kết thúc", "Nhóm công tác", "Ghi chú"];
        genData = this.generateOrder;
        url = 'api/orders/search';
        dataBind = 'data.Data.Row';
        nameSheet = "Work Order";
        break;

      case 'CÔNG CỤ':
        params = JSON.parse(JSON.stringify(tools && tools.params ? tools.params : {}));
        if (tools && tools.params) {
          delete params.skip;
          delete params.limit;
        }
        header = ["Tên công cụ", "Hãng", "Loại", 'Work Order', "Người dùng", "Trạng thái"];
        genData = this.generateTool;
        url = 'api/tools/search';
        dataBind = 'data';
        nameSheet = "Tool"
        break;

      case 'Phiếu Đổi CHTT':
        params = JSON.parse(JSON.stringify(cchtt.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["Số thay đổi CHTT", "Work Order", "Số PCT", 'Người viết phiếu', "Thời gian thay đổi", "Ghi chú"];
        genData = this.generateCchtt;
        url = 'api/cchtts/search';
        dataBind = 'data.Data.Row';
        nameSheet = "ChangeCHTT"
        break;
      case 'Phiếu Đổi GSAT':
        params = JSON.parse(JSON.stringify(cgsat.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["Số thay đổi GSAT", "Work Order", "Số PCT", 'Người viết phiếu', "Thời gian thay đổi", "Ghi chú"];
        genData = this.generateCgsat;
        url = 'api/cgsats/search';
        dataBind = 'data.Data.Row';
        nameSheet = "ChangeGSAT"
        break;
      case 'Biên bản ĐGKT':
        params = JSON.parse(JSON.stringify(bbdgkt.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["Số BBDGKT", "Phân xưởng thực hiện", "Nội dung công tác", "Work Order", "Ngày thực hiện", "Ghi chú"];
        genData = this.generateBbdgkt;
        url = 'api/bbdgkts/search';
        dataBind = 'data.Data.Row';
        nameSheet = "BBDGKT"
        console.log(params)
        break;
      case 'BPTC & JSA':
        params = JSON.parse(JSON.stringify(bptc.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["Số BPTC", "Số JSA", "Nội dung công tác", "Ghi chú"];
        genData = this.generateBptc;
        url = 'api/bptcs/search';
        dataBind = 'data.Data.Row';
        nameSheet = "BPTC&JSA"
        console.log(params)
        break;

      default:
        break;
    }

    let token = await getToken();
    getWithToken(url, token, { params }).then(res => {
      let path = dataBind.split('.')

      let array = res;
      path.forEach(i => {
        array = array[i];
      })
      console.log(array)
      let users = [];
      users.push(header);
      array.forEach((item) => {
        console.log(item)
        users.push(genData(item));
        console.log(users)
      })
      console.log(users)
      const wb = XLSX.utils.book_new();
      const wsAll = XLSX.utils.aoa_to_sheet(users);
      let cols = []
      for (let i = 0; i < header.length; i++) {
        cols.push({ wch: 15 });
      }
      wsAll['!cols'] = cols
      XLSX.utils.book_append_sheet(wb, wsAll, nameSheet);
      let name = `${nameSheet.replace(/ /g, '')}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      XLSX.writeFile(wb, name);
    }).catch(err => { return err.response });
  }
  checkPermissionAdd = () => {
    const { labelButtonAdd, user } = this.props;
    if (labelButtonAdd === 'WORK ORDER' && user && !user.admin) return true
    if (labelButtonAdd === 'Phiếu Đổi CHTT' && user && !user.admin) return true
    if (labelButtonAdd === 'Phiếu Đổi GSAT' && user && !user.admin) return true
    if (labelButtonAdd === 'Biên bản ĐGKT' && user && !user.admin) return true
    if (labelButtonAdd === 'BPTC & JSA' && user && !user.admin) return true
    return true
  }
  showExportToolType = () => {
    const { labelButtonAdd, user } = this.props;
    if (user && !user.admin) return false;
    if (labelButtonAdd !== 'CÔNG CỤ') return false;
    return true;
  }
  handleExportToolType = () => {
    const { modalActionsCreator } = this.props;
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle("Thống kê dữ liệu");
  }
  render() {
    const { classes, name, labelButtonAdd, user, isHide, isExport, match: { params }, order } = this.props;
    let isGetToolforOrder = params.orderId ? true : false;
    return (
      <div className={classes.grow}>
        {this.renderRedirect()}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleToggleSidebar}
            >

              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              {isHide || !isGetToolforOrder ? name : <>{`Thêm Công Cụ vào Work Order: ${order && order.order ? order.order.WO : ''}`}&nbsp;<Button variant="contained" className={classes.btnBack} onClick={() => { this.onClickGotoUrl('/admin/order-detail/' + order.order._id) }}>Quay lại</Button></>}
            </Typography>
            {labelButtonAdd && !isGetToolforOrder && this.checkPermissionAdd() ? <Button variant="contained" color="primary" onClick={this.openForm}>
              <Add />
              {`THÊM MỚI ${labelButtonAdd}`}
            </Button> : null}
            {isExport && user && user.admin ? <>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" color="primary" onClick={this.handleExport}><GetApp />&nbsp;Xuất file</Button></> : null}
            {this.showExportToolType() ? <>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" color="primary" onClick={this.handleExportToolType}><GetApp />&nbsp;Thống kê dữ liệu</Button></> : null}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <label>{user.name}</label>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMenu()}

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    customerActionsCreator: bindActionCreators(customerActions, dispatch),
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    showModalStatus: state.modal.showModal,
    user: state.auth.user || {},
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withStyles(styles),
  withConnect,
  withRouter,
)(Header);
