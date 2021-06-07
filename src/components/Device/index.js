import React, { Component, Fragment, } from 'react'
import moment from 'moment';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import {
    withStyles,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Fab,
    Icon,
} from '@material-ui/core';
class Device extends Component {
    render() {
        const { devices, devicesTotal, classes, onClickEdit } = this.props;
        return <Fragment>
            <Card
                key={devices._id}
                className={classes.root}>
                <CardContent >
                    <Grid container justify="space-between">
                        <Grid item md={12}>
                            Serial Number: {devices.sn}
                        </Grid>
                    </Grid>
                    {/* <p>{`${moment(timeStart).format('DD/MM/YYYY')} - ${moment(timeStart).format('DD/MM/YYYY')}`}</p> */}
                </CardContent>
                <CardActions className={classes.cardActions}>
                </CardActions>
            </Card>
        </Fragment>
    }
}

export default compose(
    withStyles(styles),
)(Device);