import AdminHomePage from '../containers/AdminHomePage';
import LoginPage from '../containers/LoginPage';
import SignupPage from '../containers/SignupPage';
import PageNotFound from '../containers/PageNotFound';

import Devices from '../containers/Devices';
import DeviceDetail from '../containers/DeviceDetail';
import DeviceOnline from '../containers/DeviceOnline';
import DeviceForm from '../containers/DeviceForm';

import Customers from '../containers/Customers';
import CustomerForm from '../containers/CustomerForm';

import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PagesIcon from '@material-ui/icons/Pages';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import FaceIcon from '@material-ui/icons/Face';
import DescriptionIcon from '@material-ui/icons/Description';
//export const API_ENDPOINT = 'https://api.yensaochampa.icu';
export const API_ENDPOINT = 'http://localhost:4002';
//export const API_ENDPOINT = 'http://128.199.82.173:4002';

export const STATUSES = [
  {
    value: 0,
    label: 'READY',
  },
  {
    value: 1,
    label: 'IN PROGRESS',
  },
  {
    value: 2,
    label: 'COMPLETE',
  },
];

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  UPDATED: 202,
};

export const ADMIN_ROUTES = [
  {
    path: '/admin',
    name: 'Trang quản trị',
    exact: true,
    component: AdminHomePage,
    form: null,
    onlyAdmin: false,
    iconSidebar : SupervisorAccountIcon,
    isHide: true
  },
  {
    path: '/',
    name: 'Trang chủ',
    exact: true,
    component: AdminHomePage,
    form: null,
    onlyAdmin: false,
    iconSidebar : PagesIcon,
    isHide: true
  },
  
  {
    path: '/admin/device',
    params: [":deviceId?"],
    name: 'Quản lý thiết bị',
    exact: false,
    component: Devices,
    form: DeviceForm,
    onlyAdmin: false,
    labelButtonAdd: 'Thiết bị',
    iconSidebar : DescriptionIcon,
    isExport: true
  },
  {
    path: '/admin/device-detail',
    params: [":deviceId"],
    name: 'Chi tiết Thiết bị',
    exact: false,
    component: DeviceDetail,
    form: DeviceForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/online-device',
    params: [":deviceId"],
    name: 'Giá trị hiện tại',
    exact: false,
    component: DeviceOnline,
    form: DeviceForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/customer',
    name: 'Quản lý người dùng',
    exact: false,
    component: Customers,
    form: CustomerForm,
    onlyAdmin: true,
    labelButtonAdd: 'NGƯỜI DÙNG',
    iconSidebar : FaceIcon,
  },
];

export const ROUTES = [
  {
    name: 'Dang nhap',
    path: '/login',
    exact: true,
    component: LoginPage,
  },
  {
    name: 'Dang ky',
    path: '/signup',
    exact: true,
    component: SignupPage,
  },
  {
    name: 'Page Not Found',
    path: '',
    exact: false,
    component: PageNotFound,
  }
]

export const limitSizeImage = 10000000;