import * as d3 from "d3"
import { useEffect, useRef } from "react"
import { D3H, ExtendedHierarchyNode, OnClick } from "./types"

export const ExpandableList = ({
  data,
  onClick = () => undefined,
}: {
  data: D3H
  onClick?: OnClick
}) => {
  const textHeight = 16
  const rowGap = 12
  const lineHeight = textHeight
  const lineOffset = 8
  const columnWidth = 50
  const columnGap = 10
  const iconWidth = 15

  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const root = d3.hierarchy(data) as ExtendedHierarchyNode
    root.sum((dataArg) => {
      const { value, factor = 1, children } = dataArg
      if (value == null) {
        return 0
      }
      if (children != null) {
        return 0
      }
      return factor * value
    })

    // console.log(root.descendants(), data)

    // Calculate positions
    let index = -1
    root.eachBefore((n) => {
      n.x = 0
      n.y = ++index * (lineHeight + rowGap)
    })
    const isBold = ({ depth, children }: ExtendedHierarchyNode) => !depth || children != null
    const isStrike = (n: ExtendedHierarchyNode) => n.data.factor === 0
    const isBranch = ({ children, depth }: ExtendedHierarchyNode) => children != null && depth !== 0
    const isMinus = ({ data }: ExtendedHierarchyNode) => data.factor != null && data.factor < 0

    d3.select(svgRef.current)
      .selectAll("g")
      .data(root, (node) => {
        const n = node as ExtendedHierarchyNode
        const { data, parent } = n
        n.id = `${parent?.data?.name ?? "-"}/${data?.name}`
        return n.id
      })
      .join(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (enter) => {
          const rowXStart = iconWidth
          const rightTextX = 2 * columnWidth + columnGap

          const rowG = enter
            .append("g")
            .attr("transform", (node) => `translate(${node.x},${40 + node.y})`)
            .classed("row", true)

          //Expand icon
          rowG
            .filter(isBranch)
            .append("text")
            .text("▼")
            .attr("transform", () => `rotate(0)`)
            .attr("transform-origin", "7 -5")

          // Subtraction icon
          rowG
            .filter(({ children }) => children == null)
            .append("text")
            .text("-")
            .classed("minus", true)

          // Titles
          rowG
            .append("text")
            .attr("x", ({ depth }) => (depth ? rowXStart : rightTextX))
            .classed("line-through", isStrike)
            .classed("text-right", ({ depth }) => !depth)
            .classed("font-bold", isBold)
            .classed("name", true)
            .text(({ data, depth }) => (depth ? data.name : "AC"))

          // Values
          rowG
            .append("text")
            .attr("x", rightTextX)
            .text(({ data, value, depth, children }) =>
              depth ? `${(children == null ? data.value : value)?.toFixed(1)}K` : "",
            )
            .classed("value", true)
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
          onClick && rowG.on("click", onClick)
        },
        (update) => {
          update
            .select("text.value")
            .classed("line-through", isStrike)
            .text(({ data, value, depth, children }) =>
              depth ? `${(children == null ? data.value : value)?.toFixed(1)}K` : "",
            )
          update.select("text.name").classed("line-through", isStrike)
          update.select("text.minus").classed("visible", isMinus)
        },
        (update) => {
          update.remove()
        },
      )
  }, [data, lineHeight, onClick])

  return <svg ref={svgRef} width="300" height="400"></svg>
}
export default ExpandableList
