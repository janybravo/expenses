import { useReducer, useState } from "react"
import "./app.css"
import ContextMenu from "./contextMenu"
import { expensesHierarchy } from "./data"
import ExpandableList from "./expendableList"
import { ExtendedHierarchyNode } from "./types"

const App = () => {
  useReducer(
    (state) => {
      return state
    },
    {} as Record<string, boolean>,
  )
  const [rowInfo, setRowInfo] = useState<null | {
    element: SVGElement
    node: ExtendedHierarchyNode
  }>(null)

  const onNodeFactorChange = (type) => {
    setRowInfo(null)
    if (!rowInfo || type == null) {
      return
    }
    const setFactor = (node: ExtendedHierarchyNode) => {
      let factor: number | null = null
      if (type === "subtract") {
        factor = -1
      } else if (type === "sum") {
        factor = 1
      } else if (type === "ignore") {
        factor = 0
      }
      node.data.factor = factor ?? undefined
    }

    if (rowInfo.node.children == null) {
      setFactor(rowInfo.node)
    } else {
      rowInfo.node.children.filter(({ children }) => children == null).forEach(setFactor)
    }
  }

  return (
    <>
      <div className="plot">
        <ExpandableList
          data={expensesHierarchy}
          onClick={(e: MouseEvent, node: ExtendedHierarchyNode) => {
            if (!e.currentTarget) {
              return
            }
            setRowInfo({ element: e.currentTarget as SVGAElement, node })
          }}
        />
      </div>
      <ContextMenu key={rowInfo?.node.id} rowInfo={rowInfo} onChange={onNodeFactorChange} />
    </>
  )
}
export default App
