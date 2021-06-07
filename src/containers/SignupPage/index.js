import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import styles from './style';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { reduxForm, Field } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import validate from './validate';
import * as CustomerActions from '../../actions/customerActions';
import { Link } from 'react-router-dom';
import renderTextField from '../../components/FormHelper/TextField';
import { withRouter } from 'react-router';

class SignupPage extends Component {
  handleSubmitForm = (data) => {
    const { customerActionsCreator } = this.props;
    const { addCustomer } = customerActionsCreator;
    const { name, email, password } = data;
    const newCustomer = {
      name,
      email,
      password,
      admin: false,
    }
    addCustomer(newCustomer);
  };
  //@check login success adn error
  componentDidUpdate(nextprops) {
    console.log('da vao day')
    const { msgError, isAuthenticated, history,customers, register } = this.props;
    console.log(register)
    // if (isAuthenticated !== nextprops.isAuthenticated) {
    //   if (isAuthenticated) {
    //     history.push('/admin/thongke');
    //   }
    if(register){
      history.push('/login')
    }
    // }
    // if (msgError !== nextprops.msgError) {
    //   this.setState({
    //     msgError
    //   })
    // }
  }
  render() {
    const { classes, handleSubmit, invalid, submitting } = this.props;
    return (
      <div className={classes.background}>
        <div className={classes.login}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(this.handleSubmitForm)}>
                <Grid container>
                  <Grid item md={12}>
                    <Field
                      id="email"
                      name="email"
                      label="Email"
                      type='text'
                      InputProps={{
                        readOnly: false,
                      }}
                      className={classes.TextField}
                      margin="normal"
                      component={renderTextField}
                    ></Field>
                  </Grid>
                  <Grid item md={12}>
                    <Field
                      id="name"
                      name="name"
                      label="Tên người dùng"
                      className={classes.TextField}
                      margin="normal"
                      component={renderTextField}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Field
                      id="password"
                      name="password"
                      label="Mật khẩu"
                      type='password'
                      className={classes.TextField}
                      margin="normal"
                      component={renderTextField}
                    ></Field>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <Button disabled={invalid || submitting} type="submit">
                      Đăng ký
                    </Button>
                    <Link to="/login">ádasd</Link>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </div>
      </div >
    );
  }
}

SignupPage.propTypes = {

};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionsCreator: bindActionCreators(CustomerActions, dispatch),
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    customers: state.customers.customers,
    register: state.customers.register,
    msgError: state.error.msg,
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'SIGNUP';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withRouter,
  withReduxForm,
)(SignupPage);