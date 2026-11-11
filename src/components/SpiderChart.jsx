import Chart from "react-apexcharts";

// `data` = resultado: { id, [nombreDon]: puntaje }
export default function SpiderChart({ data, title }) {
  const categories = Object.keys(data).filter((k) => k !== "id");
  const series = [{ name: "Dones", data: categories.map((c) => data[c]) }];
  const options = {
    chart: { type: "radar" },
    title: { text: title, align: "center", style: { color: "#ffffff" } },
    xaxis: { categories },
  };

  return <Chart className="spider" options={options} series={series} type="radar" height={300} />;
}
