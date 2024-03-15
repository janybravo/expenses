import * as d3 from "d3"

type KVObject<T> = {
  [key: string]: T
}
export type Hierarchy = Record<string, Hierarchy[] | number>
export type FinalBranch = KVObject<number>[]
export type D3H = { name: string; children?: D3H[]; value?: number; factor?: number }

export const expenses: Hierarchy[] = [
  {
    Q3: [
      {
        Jul: 113.4,
      },
      {
        Aug: 46.4,
      },
      {
        Sep: 42.7,
      },
    ],
  },
  {
    Q4: [
      {
        Oct: 115.5,
      },
      {
        Nov: 24.8,
      },
      {
        Dec: 97.2,
      },
      {
        Jan: [{ "1": 111.1 }],
      },
    ],
  },
]

const toD3Hierarchy = (data: Hierarchy): D3H => {
  const k0 = Object.keys(data)[0]
  const v0 = data[k0]
  if (Array.isArray(v0)) {
    return {
      name: k0,
      children: v0.map((v1) => toD3Hierarchy(v1)),
    }
  } else {
    return { name: k0, value: v0 }
  }
}

const expenses2 = toD3Hierarchy({ root: expenses })

const textHeight = 16
const rowGap = 12
const lineHeight = textHeight
const lineOffset = 8
const columnWidth = 50
const columnGap = 10
const iconWidth = 15

export const initTree = () => {
  const root = d3.hierarchy(expenses2)
  root.sum((dataArg) => {
    const { value, factor = 1 } = dataArg
    if (value == null) {
      return 0
    }
    return factor * value
  })

  console.log(root.descendants())

  // Calculate positions
  let index = -1
  root.eachBefore((n) => {
    n.x = 0
    n.y = ++index * (lineHeight + rowGap)
  })

  const labelsG = d3.select("svg g.labels")
  const rowG = labelsG
    .selectAll("g")
    .data(root, ({ data, parent }) => {
      return `${data?.name}/${parent?.data?.name}`
    })
    .join("g")
    .attr("transform", (node) => {
      console.log(node)
      return `translate(${node.x},${40 + node.y})`
    })

  const rowXStart = iconWidth
  const rightTextX = 2 * columnWidth + columnGap
  const isBold = ({ depth, children }: d3.HierarchyNode<D3H>) => !depth || children != null
  const isStrike = ({ data }: d3.HierarchyNode<D3H>) => data.factor === 0
  const isBranch = ({ children, depth }: d3.HierarchyNode<D3H>) => children != null && depth !== 0

  //Expand icon
  rowG
    .filter(isBranch)
    .append("g")
    .attr("transform", () => `translate(0, -15) rotate(180) scale(.5)`)
    .attr("transform-origin", "7.5 10")
    .append("path")
    .attr("d", "M10 0 L0 15 L20 15 Z")

  // Titles
  rowG
    .append("text")
    .attr("x", ({ depth }) => (depth ? rowXStart : rightTextX))
    .classed("text-right", ({ depth }) => !depth)
    .classed("font-bold", isBold)
    .classed("line-through", isStrike)
    .text(({ data, depth }) => (depth ? data.name : "AC"))

  // Values
  rowG
    .append("text")
    .attr("x", rightTextX)
    .text(({ data, value, depth, children }) =>
      depth ? `${children == null ? data.value : value}K` : "",
    )
    .classed("font-bold", isBold)
    .classed("text-right", true)
    .classed("line-through", isStrike)

  // Lines
  rowG
    .append("line")
    .attr("x1", rowXStart)
    .attr("x2", columnWidth)
    .attr("y1", lineOffset)
    .attr("y2", lineOffset)
    .filter(({ depth }) => !depth)
    .remove()
  rowG
    .append("line")
    .attr("class", ({ depth }) => (depth ? "" : "stroke-3"))
    .attr("x1", columnWidth + columnGap)
    .attr("x2", rightTextX)
    .attr("y1", lineOffset)
    .attr("y2", lineOffset)

  rowG.on("click", (event) => console.log(event.target, event.currentTarget))
}
