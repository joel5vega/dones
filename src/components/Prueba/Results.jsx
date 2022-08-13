import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Don from "../Dones/Don";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  // maintainAspectRatio: false,
  elements: {
    bar: {
      borderWidth: 1
    }
  },
  responsive: true,
  plugins: {
    datalabels: {
      display: true
    },
    legend: {
      display: false
    },
    title: {
      display: true,
      text: "Mis dones",
      fontSize: 18
    }
  }
};

function Results(props) {
  var dones = props.dones;
  var labels = props.dones.map((don) => don.name).slice(0, 5);
  const data = {
    labels,
    datasets: [
      {
        label: "Dones",
        data: dones.map((don) => don.score).slice(0, 5),
        backgroundColor: "#3952b2"
      }
    ]
  };
  return (
    <div className="results">
      {props.show && (
        <div>
          <Bar options={options} data={data} />
          <div className="dones">
            {dones.slice(0, 5).map((don, index) => (
              <Don key={index}data={don} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
