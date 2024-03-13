import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as d3 from 'd3'



type Hierarchy = Record<string, Hierarchy | number>[]


const data: Hierarchy = [{
  Q3: [{
    Jul: 113.4
  },
  {
    Aug: 46.4
  },
  {
    Sep: 42.7
  }
  ]
},
{
  Q4: [{
    Oct: 115.5
  },
  {
    Nov: 24.8
  },
  {
    Dec: 97.2
  }
    ,
  {
    X: [{ y: 111.1 }]
  }
  ]
}]


const ExpensesPlot = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
}) => {
  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight]
  );
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);
  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        d={line(data)}
      />
      <g fill="white" stroke="currentColor" stroke-width="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
}




const App = () => {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  return (<div onMouseMove={(event) => {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }}>
    <ExpensesPlot width={200} height={500} data={data} />
  </div>
  )
}

export default App
