import * as d3 from "d3"
import { RefObject, memo, useEffect, useRef } from "react"
import { D3H, OnClick } from "./types"

type ExtendedHierarchyNode = d3.HierarchyNode<D3H> & {
  x: number
  y: number
  factor?: number
  value?: number
}

export const ExpandableList = memo(({ data, onClick }: { data: D3H; onClick?: OnClick }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const textHeight = 16
  const rowGap = 12
  const lineHeight = textHeight
  const lineOffset = 8
  const columnWidth = 50
  const columnGap = 10
  const iconWidth = 15

  const createList = (
    data: D3H,
    svgRef: RefObject<SVGSVGElement>,
    onClick: OnClick = () => undefined,
  ) => {
    const root = d3.hierarchy(data) as ExtendedHierarchyNode
    root.sum((dataArg) => {
      const { value, factor = 1 } = dataArg
      if (value == null) {
        return 0
      }
      return factor * value
    })

    console.log(root.descendants(), data)

    // Calculate positions
    let index = -1
    root.eachBefore((n) => {
      n.x = 0
      n.y = ++index * (lineHeight + rowGap)
    })

    const labelsG = d3.select(svgRef.current)
    const rowG = labelsG
      .selectAll("g")
      .data(root, (node) => {
        const { data, parent } = node as ExtendedHierarchyNode
        return `${data?.name}/${parent?.data?.name}`
      })
      .join("g")
      .attr("transform", (node) => {
        return `translate(${node.x},${40 + node.y})`
      })

    const rowXStart = iconWidth
    const rightTextX = 2 * columnWidth + columnGap
    const isBold = ({ depth, children }: ExtendedHierarchyNode) => !depth || children != null
    const isStrike = ({ data }: ExtendedHierarchyNode) => data.factor === 0
    const isBranch = ({ children, depth }: ExtendedHierarchyNode) => children != null && depth !== 0

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

    rowG.on("click", onClick)
  }

  useEffect(() => {
    createList(data, svgRef, onClick)
  })

  return <svg ref={svgRef} width="300" height="400"></svg>
})
export default ExpandableList
