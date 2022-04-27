import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
function Results(props) {
  return (
    <div>
      {props.show && (
        <div>
          <h1>Resultados</h1>
          {props.dones.map((don) => (
            <div key={don.id}>
              <h3>{don.name}:{don.score}</h3>
            </div>
          ))}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart width={150} height={300} data={props.dones}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis angle={270} dataKey="name" interval={0}/>
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              <Bar dataKey="score" fill="#8884d8" label={{position:'top'}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Results;
