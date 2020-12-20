import React, { useState, useEffect } from "react";
import './App.css';
import { Line } from "react-chartjs-2";
import axios from "axios";
import DataTable from "./components/DataTable";

function App() {
  const [tideData, setTideData] = useState({});
  //const [tideTime, setTideTime] = useState([]);
  const [tideHeight, setTideHeight] = useState([]); //break it into its own state array
  const [tideTable, setTideTable] = useState([]); //for the tide table
  const [selectUnits, setSelectUnits] = useState('Meters'); //for the chart label
  const [unitParam, setUnitParam] = useState('metric'); //for the api parameter
  const [userTime, setUserTime] = useState('lst_ldt'); //for the user time zone
  const [datum, setDatum] = useState('MLLW');
  const [station, setStation] = useState('9414290');
  //const [fromDay, setFromDay] = useState('2020');

  useEffect(() => {
    getData();
  }, [station]); //recall the api if units change

  const getData = () => {
    //make the axios request, i mainly want the time data and their tide height properties
    let tHeights = [];
    let tDay = [];
    
    //make the api call for the noaa tide prediction api
    const axioOptions = {
      method: 'GET',
      url: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
      params: {station: `${station}`, begin_date: '20201215', end_date: '20201221', product: 'predictions', datum: `${datum}`,
        units: `${unitParam}`, time_zone: `${userTime}`, interval: 'hilo', format: 'json'},
    };

    axios.request(axioOptions).then(function(response) {
      console.log(response); //for testing purposes
      setTideTable(response.data.predictions);
      //get the time and date from the t element
      for(const dataObj of response.data.predictions){
        let timeInfo = dataObj.t.split(" "); //the time and date are seperated by whitespace
        tDay.push([timeInfo[0], timeInfo[1]]);
      }

      //get the height from the v property
      for(const extreme of response.data.predictions) {
        tHeights.push(extreme.v);
      }

      setTideData({
        labels: tDay,
        datasets: [
          {
            data: tHeights,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 4,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          }
        ]
      });

      setTideHeight(tHeights);
      
    }).catch(function(error) {
      console.error(error);
    });
  }

  const options = {
    responsive: true,
    title: {
      display: true,
      text: [`Tide Levels for a Station (MLLW) in ${selectUnits}`, `Tide Predictions at ${station}, San Francisco Station`],
      fontFamily: 'Arial'
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        { //removed the ticks, chart automatically adjusts based on the data limits
          scaleLabel: {
            display: true,
            fontStyle: 'bold',
            labelString: `Height in ${selectUnits} (${datum})`
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            display: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Day/ Time of Tide'
          }
        }
      ]
    },
    maintainAspectRatio: false,//this didnt make it full screen anymore for false
  };

  //Update the chart axis based on the unit chosen from the dropdown 
  const handleUnits = (e) => {
    setSelectUnits(e.target.value);
    //feet = pass in english for the api call, meters = pass in metric for the api call
    if(e.target.value === 'Feet') {
      setUnitParam('english');
    } 
    if(e.target.value === 'Meters') {
      setUnitParam('metric');
    }
  }

  //this is for the station location, i.e. get predictions from a diff place in California
  const changeStation = (e) => {
    setStation(e.target.value);
  }

  const changeTimeZone = (e) => {
    //update the time zone user selects in state
    setUserTime(e.target.value);
  }

  const changeDatum = (e) => {
    //update the datum in user state
    setDatum(e.target.value);
  };

  return (
    <div className="App">
      <h2>Weekly Tide Levels in MSL datum</h2>
      <div className="chart-container"> 
        <Line data={tideData} options={options} />
      </div>
      <div className="chooser"> 
        <div className='column1'>
          <h2>Options For</h2>
          <select className='station-selector' defaultValue='9414290' onChange={changeStation}>
            <option value="9414290">9414290 San Francisco</option>
            <option value="9413745">9413745 Santa Cruz,Monterey Bay,CA</option>
            <option value="9414275">9414275 Ocean Beach, Outer Coast, CA</option>
            <option value="9414806">9414806 Sausalito, San Francisco, CA</option>
          </select>
          <h2>From:</h2>
            <select className='month-selector' defaultValue='December'>
              <option value="Jan">January</option>
              <option value="Feb">Feburary</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <select className='day-selector' defaultValue='16'>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
            </select>
            <input type="text" className='from-year' />
          <h2>To:</h2>
            <select className='month-selector' defaultValue='December'>
              <option value="Jan">January</option>
              <option value="Feb">Feburary</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <select className='day-selector'>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
            </select>
            <input type="text" className='to-year' />
          </div>
        <div className='column2'>
          <h3>Units</h3>
            <select defaultValue='Meters' onChange={e => handleUnits(e)}>
              <option value='Meters'>Meters</option>
              <option value='Feet'>Feet</option>
            </select>
          <h3>Timezone</h3>
            <select className='timezone-selector' defaultValue='lst_ldt' onChange={e => changeTimeZone(e)}>
              <option value="gmt">gmt</option>
              <option value="lst">lst</option>
              <option value="lst_ldt">lst_ldt</option>
            </select>
          <h3>Datum</h3>
            <select className='datum-selector' defaultValue='MLLW' onChange={changeDatum}>
              <option>MHHW</option>
              <option>MHW</option>
              <option>MTL</option>
              <option value="MLLW">MLLW</option>
            </select>
        </div>
        <div className="column3">
          <h2>Shift Dates</h2>
          <button className='back-date'>Back 1 Day</button>
          <button className="forward-date">Forward 1 Day</button>
          <h2>Update</h2>
          <button className='daily-submit' onClick={getData}>Plot Daily</button>
          <button>Plot Calendar</button>
        </div>
      </div>
      <DataTable data={tideTable} units={selectUnits} zone={userTime} />

    </div>
  );
}

export default App;
