import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";

const STROKE_COLOR = "#71c179";

const Chart = ({ data }) => {
  return (
    data.length > 0 && (
      <LineChart
        width={250}
        height={90}
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" hide />
        <Tooltip
          labelStyle={{ fontSize: ".7rem", color: "#777", fontWeight: 400 }}
          contentStyle={{
            fontSize: ".8rem",
            fontWeight: 600,
            textTransform: "uppercase"
          }}
        />

        <Line type="linear" dataKey="conversions" stroke={STROKE_COLOR} />
      </LineChart>
    )
  );
};

export default Chart;
