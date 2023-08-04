import React, { useRef } from "react";
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
import { Link } from "react-router-dom";
import Don from "../Dones/Don";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import {
  exportComponentAsJPEG,
  exportComponentAsPNG
} from "react-component-export-image";

import { Button } from "@mui/material";
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

const ComponentToPrint = React.forwardRef((props, ref) => (
  <div ref={ref} className="results">
    <Bar options={props.options} data={props.data} />
    <div className="dones">
      {props.dones.slice(0, 4).map((don, index) => (
        <Don key={index} data={don} />
      ))}
    </div>
    Fuente: joel5vega.github.io/dones
  </div>
));

function Results(props) {
  var dones = props.dones;
  var labels = props.dones.map((don) => don.name).slice(0, 4);
  const componentRef = useRef();
  const data = {
    labels,
    datasets: [
      {
        label: "Dones",
        data: dones.map((don) => don.score).slice(0, 4),
        backgroundColor: "#3952b2"
      }
    ]
  };
  return (
    <div className="resultados">
      {props.show && (
        <React.Fragment>
          <ComponentToPrint
            ref={componentRef}
            options={options}
            data={data}
            dones={dones}
          />
          <div
            className="boton"
            onClick={() =>
              exportComponentAsJPEG(componentRef, { fileName: "misdones" })
            }
          >
            Descargar resultados
          </div>
          <Link
            style={{
              margin: "2rem",
              color: "var(--fondo)",
              background: "var(--activo)",
              padding: "1rem",
              minHeight: "1rem ",
              borderRadius: "1rem"
            }}
            to="/lista"
            onClick={() =>
              exportComponentAsJPEG(componentRef, { fileName: "misdones" })
            }
          >
            Ver listado de todos los dones
          </Link>
        </React.Fragment>
      )}
    </div>
  );
}

export default Results;
