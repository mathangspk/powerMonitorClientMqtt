import React, { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import moment from 'moment';


const BarChart2 = (props) => {
    var { data } = props
    console.log(data)
    var dateArray = [];
    var voltArray = [];
    var powerArray = [];
    if (data) {
        for (var i = 0; i < data.length; i++) {
            //      console.log(data[i].date)
            dateArray.push(moment(data[i].date).format('DD/MM/YYYY HH:mm:ss'));
            //voltArray.push(data[i].volt);
            if (data[i].value) {
                powerArray.push(data[i].value.totalEnergy);
            } else {
                powerArray.push(0)
            }
        }
    }
    //  console.log(dateArray)

    return <div>
        <Bar
            data={{
                title: {
                    display: true,
                    text: 'Sản lượng điện tiêu thụ'
                },
                labels: dateArray,
                datasets: [
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
                            // 'rgba(255, 99, 132, 1)',
                            // 'rgba(54, 162, 235, 1)',
                            // 'rgba(255, 206, 86, 1)',
                            // 'rgba(75, 192, 192, 1)',
                            // 'rgba(153, 102, 255, 1)',
                            // 'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,
                        pointBorderWidth: 0,
                    }
                ]
            }}
            width={120}
            height={30}
            options={
                { maintainAspectRatio: false },
            {
                plugins: {
                    title: {
                        display: true,
                        text: 'Chart Title',
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        formatter: Math.round,
                        font: {
                          weight: 'bold'
                        }
                      }
                }
            }}
        />
    </div>
}

export default BarChart2