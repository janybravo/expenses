import Big from "big.js"
import clsx from "clsx"
import * as d3 from "d3"
import { useEffect, useReducer, useRef } from "react"
import "./App.css"
import { Hierarchy } from "./data"

// const isHierarchy = (obj: unknown): obj is FinalBranch => {
//   if (obj == null) {
//     return false
//   }
//   const key0 = Object.keys(obj)[0]
//   if (key0 == null) {
//     return false
//   }
//   const v = key0 in obj
//   return Number.isFinite(v)
// }

enum Effect {
  Skip,
  Invert,
}
const defaultMargin = {
  top: 40,
  bottom: 0,
  left: 40,
  right: 0,
} as const
const textHeight = 16
const height = {
  text: textHeight,
  line: textHeight + 10,
  lineOffset: -12,
  rowGap: 20,
  columnGap: 20,
}

const offIndexY = 0

const getY = (index: number, margin = defaultMargin) => {
  return (offIndexY + index) * (height.line + height.rowGap) + margin.left
}

const appendCell = ({
  svg,
  column = 0,
  row = 0,
  w = 100,
  value = "",
  className = "",
  margin = defaultMargin,
}: {
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>
  column?: number
  row?: number
  w?: number
  value?: string
  className?: string
  margin?: typeof defaultMargin
}) => {
  const x = margin.left + column * (w + height.columnGap)
  const y = getY(row, margin)
  svg
    .append("g")
    .attr("transform", `translate(${x},${y})`)
    .append("line")
    .attr("x1", 0)
    .attr("x2", w)
    .attr("y1", 0)
    .attr("y2", 0)
    .exit()
    .append("text")
    .attr("x", x + (className?.includes("text-right") ? w : 0))
    .attr("y", y + height.lineOffset)
    .attr("class", className)
    .text(value)
}

const appendRow = ({
  row,
  svg,
  values,
  effect = null,
  isExpandable = false,
  className,
}: {
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>
  row: number
  isExpandable?: boolean
  effect?: Effect | null
  values?: string[]
  className?: string
}) => {
  appendCell({ svg, row, value: values?.[0], className })
  appendCell({
    svg,
    column: 1,
    row,
    value: values?.[1],
    className: clsx("text-right", className),
  })
}

const toCurrency = (v: number | string) => `${v}K`
const sumGroupRows = (subGroup: Hierarchy) => {
  const sum = subGroup
    .reduce((a, kv) => {
      const v = Object.values(kv)
      if (Number.isFinite(v[0])) {
        return a.plus((v as number[])[0])
      }
      return a
    }, new Big(0))
    .toFixed(1)
  return toCurrency(sum)
}

const appendSection = (
  data: Hierarchy,
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>,
  curry: { rowIndex: number; sum: number },
) => {
  let rowIndex = 0
  data.forEach((group) => {
    const firstKey = Object.keys(group)[0]
    if (!Number.isFinite(group[firstKey])) {
      // console.log("branch", curry.rowIndex, data)
      const subGroup = group[firstKey] as Hierarchy
      const sum = sumGroupRows(subGroup)
      const row = curry.rowIndex++
      // console.log(row)
      appendRow({ svg, row, values: [firstKey, sum], className: "font-bold" })
      const x = svg.append("g").attr("transform", `translate(${0},${getY(row)})`)
      appendSection(subGroup, x, curry)
    } else {
      // console.log("leaf", curry.rowIndex, group)
      curry.rowIndex++

      appendRow({
        svg,
        row: rowIndex++,
        values: [firstKey, `${Number(group[firstKey]).toFixed(1)}K`],
      })
    }
  })
}

const ExpensesPlot = ({
  data,
  widthViewport = 640,
  heightViewport = 600,
}: {
  data: Hierarchy
  widthViewport?: number
  heightViewport?: number
  margin?: typeof defaultMargin
}) => {
  const container = useRef<HTMLDivElement>(null)
  const [rowState, dispatch] = useReducer(
    (state) => {
      return state
    },
    {} as Record<string, boolean>,
  )

  const viewData = data

  // useLayoutEffect(() => {
  //   const svg = d3
  //     .create("svg")
  //     .attr("width", widthViewport)
  //     .attr("height", heightViewport)
  //     .attr("viewBox", [0, 0, widthViewport, heightViewport])
  //     .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
  //   appendSection(viewData, svg, { rowIndex: 0, sum: 0 })
  //   container.current?.replaceChildren(svg.node()!)
  // }, [viewData, heightViewport, widthViewport])

  return <div className="view" ref={container}></div>
}

const App = () => {
  useEffect(() => {}, [])

  return <div className="plot">{/* <ExpensesPlot data={expenses} /> */}</div>
}
export default App
