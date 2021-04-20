import React, { useState } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Lottie from "react-lottie";
import loader from "./lotties/water-loader.json";
import Waves from "./components/Waves";
import WaveLoader from "./components/WaveLoader";
import DataTable from "./components/DataTable";
import CsvDownloader from "react-csv-downloader";
import Button from "react-bootstrap/Button";

let startDay = new Date().getDate();
let startMonth = new Date().getMonth() + 1;

if (startDay < 10) {
  startDay = "0" + startDay.toString();
}

//for default To date, add 7 to the initial date
//i wonder if i pass the last day of the current month, will i move on to the next month number? yes, i get it!
let day2 = new Date();
day2.setDate(day2.getDate() + 7);
let endMonth = day2.getMonth() + 1;

const initialValues = {
  start: startDay,
  fromMonth: startMonth,
  end: day2.getDate(),
  toMonth: endMonth,
};

//the numbers for the months will correspond to their string representation,
//i.e. 4 for the month will match up with the option with value=4, which is April

function App() {
  const [tideData, setTideData] = useState({});
  const [tideHeight, setTideHeight] = useState([]); //break it into its own state array
  const [tideTable, setTideTable] = useState([]); //for the tide table
  const [selectUnits, setSelectUnits] = useState("Meters"); //for the chart label
  const [unitParam, setUnitParam] = useState("metric"); //for the api parameter
  const [userTime, setUserTime] = useState("lst_ldt"); //for the user time zone
  const [datum, setDatum] = useState("MLLW");
  const [station, setStation] = useState("9414290");
  const [dates, setDates] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [showChart, setShowChart] = useState(false); //for the rendering of the chart first time, then each state update just rerenders the chart

  const getData = () => {
    setIsLoading(true); //trigger the loading screen
    //make the axios request, i mainly want the time data and their tide height properties
    let tHeights = [];
    let tDay = [];

    //on initial call, use the current date for the from date parameter
    const today = new Date();

    let mon = dates.fromMonth;
    //reformat the month values in state - if month is < 10, attach a 0 in front so api can read it
    if (mon < 10) {
      mon = "0" + mon.toString();
    }

    let fromDate = today.getFullYear().toString() + mon + dates.start; //the updated fromDay
    console.log("the from date is: " + fromDate);
    /*by default, set the end date 7 days after the fromDate*/
    let toDate = today.getFullYear().toString() + mon + dates.end;

    //make the api call for the noaa tide prediction api
    const axioOptions = {
      method: "GET",
      url: "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter",
      params: {
        station: `${station}`,
        begin_date: `${fromDate}`,
        end_date: `${toDate}`,
        product: "predictions",
        datum: `${datum}`,
        units: `${unitParam}`,
        time_zone: `${userTime}`,
        interval: "hilo",
        format: "json",
      },
    };

    axios
      .request(axioOptions)
      .then((response) => {
        console.log(response); //for testing purposes
        setIsLoading(false);
        setTideTable(response.data.predictions);
        displayChart(); //switch on the chart element
        //get the time and date from the t element
        for (const dataObj of response.data.predictions) {
          let timeInfo = dataObj.t.split(" "); //the time and date are seperated by whitespace
          tDay.push([timeInfo[0], timeInfo[1]]);
        }

        //get the height from the v property
        for (const extreme of response.data.predictions) {
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
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
            },
          ],
        });

        setTideHeight(tHeights);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const options = {
    responsive: true,
    title: {
      display: true,
      text: [
        `Tide Levels in ${selectUnits}`,
        `Tide Predictions at ${station}, San Francisco Station`,
      ],
      fontFamily: "Arial",
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          //removed the ticks, chart automatically adjusts based on the data limits
          scaleLabel: {
            display: true,
            fontStyle: "bold",
            labelString: `Height in ${selectUnits} (${datum})`,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: true,
          },
          scaleLabel: {
            display: true,
            fontStyle: "bold",
            labelString: "Day/ Time of Tide",
          },
        },
      ],
    },
    maintainAspectRatio: false, //this didnt make it full screen anymore for false
  };

  //Update the chart axis based on the unit chosen from the dropdown
  const handleUnits = (e) => {
    setSelectUnits(e.target.value);
    //feet = pass in english for the api call, meters = pass in metric for the api call
    if (e.target.value === "Feet") {
      setUnitParam("english");
    }
    if (e.target.value === "Meters") {
      setUnitParam("metric");
    }
  };

  //this is for the station location, i.e. get predictions from a diff place in California
  const changeStation = (e) => {
    setStation(e.target.value);
  };

  const changeTimeZone = (e) => {
    //update the time zone user selects in state
    setUserTime(e.target.value);
  };

  const changeDatum = (e) => {
    //update the datum in user state
    setDatum(e.target.value);
  };

  //show the chart ONLY on the button click, prevent it from appearing until the FIRST button press
  const displayChart = () => {
    if (showChart === false) {
      //i dont want the button to act like a toggle between on and off
      setShowChart(true);
    }
  };

  const handleDayChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    setDates({ ...dates, [name]: value });
  };

  // const columns = [
  //   {
  //     id: "t",
  //     displayName: "Time",
  //   },
  //   {
  //     id: "v",
  //     displayName: "Predicted Height",
  //   },
  //   {
  //     id: "type",
  //     displayName: "High/Low",
  //   },
  // ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="App">
      {/* show this when the tideData is actually filled, after the api gets called (in place of the filters box?)*/}
      <div className="grid-container">
        <header className="tide-title">TIDES</header>
        <div className="main-content">
          {showChart ? (
            <div className="chart-container">
              <Line data={tideData} options={options} />
            </div>
          ) : null}
          <div class="container filter-container">
            <div class="row top-row">
              <div class="col-md-6 mb-3">
                <label htmlFor="station">Station Name</label>
                <select class="form-select shadow" onChange={changeStation}>
                  <option value="9414290">9414290 San Francisco</option>
                  <option value="9413745">
                    9413745 Santa Cruz, Monterey Bay,CA
                  </option>
                  <option value="9414275">
                    9414275 Ocean Beach, Outer Coast, CA
                  </option>
                  <option value="9414806">
                    9414806 Sausalito, San Francisco, CA
                  </option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label htmlFor="from-month">From:</label>
                <select
                  class="form-select shadow mb-1"
                  name="fromMonth"
                  onChange={handleDayChange}
                  value={dates.fromMonth}
                >
                  <option value="1">January</option>
                  <option value="2">Feburary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <select
                  class="form-select shadow"
                  name="start"
                  onChange={handleDayChange}
                  value={dates.start}
                >
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
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label htmlFor="to-month">To:</label>
                <select
                  class="form-select shadow mb-1"
                  name="toMonth"
                  onChange={handleDayChange}
                  value={dates.toMonth}
                >
                  <option value="1">January</option>
                  <option value="2">Feburary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <select
                  class="form-select shadow"
                  name="end"
                  onChange={handleDayChange}
                  value={dates.end}
                >
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
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                </select>
              </div>
            </div>
            {/* 2nd row with the other elements seperated out in col-3 pieces */}
            <div class="row bottom-row">
              <div class="col-md-4 mb-3">
                <label htmlFor="units">Units</label>
                <select
                  class="form-select shadow"
                  required
                  onChange={handleUnits}
                >
                  <option value="Meters">Meters</option>
                  <option value="Feet">Feet</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label htmlFor="timezone">Timezone</label>
                <select
                  class="form-select shadow"
                  required
                  onChange={changeTimeZone}
                >
                  <option value="gmt">gmt</option>
                  <option value="lst">lst</option>
                  <option value="lst_ldt">lst_ldt</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label htmlFor="timezone">Datum</label>
                <select
                  class="form-select shadow"
                  required
                  onChange={changeDatum}
                >
                  <option value="MHHW">MHHW</option>
                  <option value="MHW">MHW</option>
                  <option value="MTL">MTL</option>
                  <option value="MLLW">MLLW</option>
                </select>
              </div>
              <Button
                className="search-tides"
                variant="primary"
                disabled={isLoading}
                onClick={!isLoading ? getData : null}
              >
                {isLoading ? (
                  <Lottie options={defaultOptions} />
                ) : (
                  "GET YOUR TIDE"
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="bottom-wave">
          {/* wrap the animated wave with a container- looks better visually, otherwise it looks cut off*/}
          <Waves />
        </div>
      </div>
    </div>
  );
}

export default App;
