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
import Don from "./Don";
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
  elements: {
    bar: {
      borderWidth: 2
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
      fontSize: 20
    }
  }
};

function Results(props) {
  var dones = props.dones;
  var labels = props.dones.map((don) => don.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Dones",
        data: dones.map((don) => don.score),
        backgroundColor: "#3952b2"
      }
    ]
  };
  return (
    <div>
      {props.show && (
        <div>
          <Bar options={options} data={data} />
          <div className="dones">
            {dones.map((don) => (
              <Don data={don} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
