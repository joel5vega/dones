import React, { useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Link } from "react-router-dom";
import Don from "../Dones/Don";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
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
import SpiderChart from "./SpiderChart";
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
    {/* <Bar options={props.options} data={props.data} /> */}
    <div className="result-graphic">
      {props.resultado && (
        <SpiderChart
          title={"Mis dones: " + props.user}
          data={props.resultado}
          subgroups={props.subgroups}
        />
      )}
    </div>
    <div className="dones">
      {props.dones.slice(0, 3).map((don, index) => (
        <Don key={index} data={don} />
      ))}
    </div>
    Fuente: joel5vega.github.io/dones
  </div>
));

function Results(props) {
  const [dataUrl, setDataUrl] = useState("");
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
  const handleShare = () => {
    exportComponentAsJPEG(componentRef).then((file) => {
      console.log(file); // Check the value of the file variable
      const reader = new FileReader();
      reader.onload = (event) => {
        setDataUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    });
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
            resultado={props.resultado}
            subgroups={props.subgroups}
            user={props.user.displayName.split(" ")[0]}
          />
          <div className="stack">
            <div
              className="boton"
              onClick={() =>
                exportComponentAsJPEG(componentRef, { fileName: "misdones" })
              }
            >
              Descargar resultados
            </div>
            <button onClick={handleShare}>Generate Image</button>
            <WhatsappShareButton
              url={dataUrl}
              title="My Image"
              onClick={() =>
                exportComponentAsJPEG(componentRef).then((file) => {
                  console.log(file); // Check the value of the file variable
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setDataUrl(event.target.result);
                  };
                  reader.readAsDataURL(file);
                })
              }
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <Link
              style={{
                margin: "1rem",
                color: "var(--informacion)",
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
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Results;
