import React from "react";
import Chart from "react-apexcharts";

const SpiderChart = ({ data, title }) => {
  const categories = Object.keys(data).filter((key) => key !== "id");
  const values = categories.map((category) => data[category]);

  const series = [
    {
      name: "Dones",
      data: values,
    },
  ];

  const options = {
    chart: {
      height: 200,
      type: "radar",
    },
    title: {
      text: title,
      align: "center",
      style: {
        color: "#ffffff",
      },
    },
    xaxis: {
      categories: categories,
    },
  };

  return <Chart className="spider" options={options} series={series} type="radar" height={300} />;
};

export default SpiderChart;
