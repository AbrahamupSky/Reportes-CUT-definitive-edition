import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
const API = process.env.REACT_APP_API;

export const Plot = () => {

    const id = sessionStorage.getItem("id");
    const [category, setCategory] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        const course = [];
        const courseCount = [];
        
        const opts = {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codigo: id,
          }),
        };
        
        fetch(`${API}/plot`,opts)
            .then(response => response.json())
            .then(query => {
                query.data.map(item => {
                  course.push(item.courseName)
                  courseCount.push(item.qty);
              })
              setCategory(course)
              setData(courseCount)
            });

    }, [])

    return (
        <Chart options={{
            chart: {
                id: 'apexchart-example'
            },
            xaxis: {
                categories: category
            },
            plotOptions:{
              bar:{
                distributed: true,
                horizontal:true,
                dataLabels: {
                  position: 'bottom'
                }
              }
            },
            colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
                '#f48024', '#69d2e7'
              ],
            dataLabels: {
              enabled: true,
              textAnchor: 'start',
              style: {
                colors:['#000000']
              }
            },
            offsetxx:0,
            dropShadow:{
              enabled: true
            },
            stroke: {
              width:1,
              colors:['#000000']
            },
      
            yaxis:{
              labels:{
                show: false
              }
            },
            title:{
              text: 'Rendimiento',
              align: 'center',
              floating: true
            },
            tooltip:{
              theme: 'dark'
            },

        }}
            series={[{
                name: 'Cantidad',
                data: data
            }]}
          
             type="bar" />
    )
};

export default Plot

