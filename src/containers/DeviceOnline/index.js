import React, { useState, useEffect } from 'react'
import { useStyles } from 'react-styles-hook'
import { Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { ArrowBackIos, Edit } from '@material-ui/icons';
import style from '../App/style';
var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
//var Topic = '#'; //subscribe to all topics

const DeviceOnline = (props) => {
  //console.log(props);
  let Topic = props.match.params.deviceId;
  const [client, setClient] = useState(null);
  const [isSubed, setIsSub] = useState(false);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState('Connect');
  const [stringDataRec, setStringDataRec] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [urlRedirect, setUrlRedirect] = useState('');


  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connecting');
    var host = 'ws://128.199.82.173';
    var mqttOption = {
      clientId: 'MyMQTTjj',
      port: 9001,
      //username: 'mqtt_user',
      //password: 'mqtt_password',	
      keepalive: 60
    };
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    if (client) {
      //console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        //  console.error('Connection error: ', err);
        client.end();
      });
      client.subscribe(Topic, (error) => {
        if (error) {
          //    console.log('Subscribe to topics error', error)
          return
        }
        setIsSub(true)
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
        //console.log(payload)
        let messageRec = payload.message.split("-")
        const stringData = {
          volt: messageRec[0],
          curr: messageRec[1],
          power: messageRec[2],
          en: messageRec[3],
          fre: messageRec[4],
          powerFactor: messageRec[5]
        }
        setStringDataRec(stringData)
      });
    }
  }, [client]);

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        setConnectStatus('Connect');
      });
    }
  }


  const styles = useStyles({
    container: {
      marginTop: 100,
      height: '100vh',
      width: '100%',
      color: 'white',
      fontSize: 20,
      backgroundColor: 'black'
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    gauge: {
      width: '100%',
      maxWidth: '250px',
      marginLeft: '15%'
    },
    gauge__body: {
      width: '100%',
      height: 0,
      paddingBottom: '50%',
      background: '#b4c0be',
      position: 'relative',
      borderTopLeftRadius: '100% 200%',
      borderTopRightRadius: '100% 200%',
      overflow: 'hidden',
    },
    gauge__fill: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: 'inherit',
      height: '100%',
      background: '#009578',
      transformOrigin: 'center top',
      transform: 'rotate(0.25turn)',
      transition: 'transform 0.2s ease-out',
      overflow: 'hidden',
    },
    gauge__cover: {
      width: '75%',
      height: '150%',
      background: 'black',
      position: 'absolute',
      borderRadius: '50%',
      top: '25%',
      left: '50%',
      transform: 'translateX(-50%)',
      //TEXT
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '25%',
      boxSizing: 'border-box',
    },
    gauge__name:{
      display: 'flex',
      alignItems:'center',
      justifyContent: 'center',
    }
  })
  if (!client) {
    mqttConnect();
  }
  const onClickGotoList = (urlRedirect) => {
    setRedirect(true);
    setUrlRedirect(urlRedirect)
    { mqttDisconnect() }
  }
  const renderRedirect = () => {
    if (redirect) {
      return <Redirect to={urlRedirect} />
    }
  }
  const gaugeElement = document.querySelector('.gauge')

  const setGaugeValue = (gauge, value, valueString) => {
    if (value < 0 || value > 1) {
      return;
    }

    if (gauge) {
      gauge.querySelector('.gauge__fill').style.transform = `rotate(${value / 2}turn)`;
      gauge.querySelector('.gauge__cover').textContent = `${parseFloat(valueString).toFixed(1)}V`;
      
    }
  }
  if (stringDataRec.volt) {
    let voltage = Number(stringDataRec.volt) / 300
    console.log(Number(stringDataRec.volt))
    setGaugeValue(gaugeElement, voltage, stringDataRec.volt)
  }

  return <div style={styles.container}>
    {renderRedirect()}
    <Button variant="contained" color="primary" onClick={() => { onClickGotoList('/admin/device') }}>
      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
    </Button>
    <div>Điện áp: {stringDataRec.volt} V</div>
    <div>Dòng Điện: {stringDataRec.curr} A</div>
    <div>Công suất: {stringDataRec.power} W</div>
    <div>Tổng số điện: {stringDataRec.en} Kwh</div>
    <div>Tần số: {stringDataRec.fre} Hz</div>
    <div>Hệ số pF: {stringDataRec.powerFactor}</div>
    <div className='gauge' style={styles.gauge} >
      <div className='gauge__body' style={styles.gauge__body}>
        <div className='gauge__fill' style={styles.gauge__fill}></div>
        <div className='gauge__cover' style={styles.gauge__cover}></div>
      </div>
      <div className='gauge__name' style={styles.gauge__name}>Điện áp</div>
    </div>
  </div>
}

export default DeviceOnline