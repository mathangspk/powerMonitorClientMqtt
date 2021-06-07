import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment';


const BarChart = (props) => {

    var { data } = props
 //   console.log(data)
    var dateArray = [];
    var voltArray = [];
    var powerArray = [];
    for (var i = 0; i < data.length; i++) {
  //      console.log(data[i].date)
        dateArray.push(moment(data[i].date).format('DD/MM/YYYY HH:mm:ss'));
        voltArray.push(data[i].volt);
        powerArray.push(data[i].power);
    }
 //  console.log(dateArray)
    
    return <div>
        <Line
            data={{
                labels: dateArray,
                datasets: [{
                    label: 'Voltage',
                    data: voltArray,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Power',
                    data: powerArray,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
                ]
            }}
            width={100}
            height={300}
            options={{ maintainAspectRatio: false }}
        />
    </div>
}

export default BarChart