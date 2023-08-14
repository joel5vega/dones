import React from "react";
import Chart from "react-apexcharts";

const SpiderChart = ({ data, subgroups, title }) => {
  const categories = Object.keys(data).filter((key) => key !== "id");
  const values = categories.map((category) => data[category]);

  const series = [
    {
      name: "Dones",
      data: values,
    },
  ];

  const subgroupLabels = Object.values(subgroups).reduce(
    (acc, subgroup, index) => {
      if (!acc[subgroup]) {
        acc[subgroup] = { text: subgroup, x: index };
      }
      return acc;
    },
    {}
  );

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
    annotations: {
      position: "front",
      labels: Object.values(subgroupLabels),
    },
  };

  return <Chart className="spider" options={options} series={series} type="radar" height={300} />;
};

export default SpiderChart;
