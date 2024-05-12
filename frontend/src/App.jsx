import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';

function App() {
  const [cricketData, setCricketData] = useState({
    nameArray: [],
    runsArray: [],
    fifty: [],
    century: [],
    fours: [],
    sixes: [],
  });
  const [year, setYear] = useState(2024);
  const [selectedStat, setSelectedStat] = useState('fours');
  const [loading, setLoading] = useState(false); // Default selected statistical category

  useEffect(() => {
    fetchData();
    console.log("api fetch");
  }, [year]); // Run effect whenever year or selectedStat changes

  const fetchData = () => {
    setLoading(true);
    axios.get(`/api/cricket?year=${year}`)
      .then((res) => {
        setCricketData(res.data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const chartSetting = {
    xAxis: [
      {
        label: selectedStat,
        min: 0
      },
    ],
    yAxis: [
      {
        scaleType: 'band',
        dataKey: 'player',
        tickLabelStyle: {
          fontSize: '12px',
          textAnchor: 'end',
          dominantBaseline: 'middle',
        },
      },
    ],
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleStatChange = (e) => {
    setSelectedStat(e.target.value);
  };

  const barData = cricketData.nameArray
  .map((name, index) => ({ player: name, [selectedStat]: cricketData[selectedStat][index] }))
  .filter((item) => item[selectedStat] != 0) 
  .sort((a, b) => b[selectedStat] - a[selectedStat])
  .slice(0, 10)

  return (
    <>
      <h1>Interactive Cricket Data Visualization</h1>
      <h3>With Pupperteer and Chart.js</h3>
      <div className="controls">
        <select id="yearSelect" value={year} onChange={handleYearChange}>
          {Array.from({ length: 11 }, (_, index) => 2014 + index).map((yearValue) => (
            <option key={yearValue} value={yearValue}>
              {yearValue}
            </option>
          ))}
        </select>

        <select id="statSelect" value={selectedStat} onChange={handleStatChange}>
          <option value="runsArray">Runs</option>
          <option value="fifty">Fifties</option>
          <option value="century">Centuries</option>
          <option value="fours">Fours</option>
          <option value="sixes">Sixes</option>
        </select>

      </div>

      <div className='main'>
        <div className="bar-chart-container">
        {loading ? (
            <div>
              <div className="loader">
            </div>
            <h2>Loading......</h2>
            <p>Usually takes 30 to 40 seconds for data fetching through Puppeteer.</p>
            </div> // Display a loading message while fetching data
          ) : (
            <BarChart
              dataset={barData}
              margin={{
                left: 130,
                right: 30,
                top: 60,
                bottom: 80,
              }}
              series={[
                {
                  dataKey: selectedStat,
                  label: selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1),
                },
              ]}
              layout="horizontal"
              {...chartSetting}
            />
          )}
        </div>
      </div>
    </>
  );
}


export default App;
