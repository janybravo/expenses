import { MinusCircleIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import MuiMenu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"
import "./app.css"
import { ExtendedHierarchyNode } from "./types"

type RowInfo = null | {
  element: SVGElement
  node: ExtendedHierarchyNode
}
export type OnChangeType = "subtract" | "sum" | "ignore" | null

const Menu = ({
  rowInfo,
  onChange,
}: {
  rowInfo: RowInfo
  onChange: (type: OnChangeType) => void
}) => {
  const [isOpen, setIsOpen] = useState(rowInfo != null)
  const [action, setAction] = useState<OnChangeType>(null)

  const onActionClick = (type: OnChangeType) => async () => {
    setIsOpen(false)
    setAction(type)
  }

  const nodeFactor = rowInfo?.node.data.factor
  const showSubtract = nodeFactor == null || nodeFactor >= 0
  const showSum = rowInfo?.node.children != null || (nodeFactor != null && nodeFactor <= 0)
  const showIgnore = nodeFactor !== 0

  return (
    <MuiMenu
      anchorEl={rowInfo?.element}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onTransitionExited={() => {
        onChange(action)
      }}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      sx={{
        ".MuiMenuItem-root": { gap: ".5rem", fontSize: ".8rem", minHeight: "1rem" },
      }}
    >
      {showSum && (
        <MenuItem onClick={onActionClick("sum")}>
          <PlusCircleIcon className="menu-icon" /> Sum
        </MenuItem>
      )}
      {showSubtract && (
        <MenuItem onClick={onActionClick("subtract")}>
          <MinusCircleIcon className="menu-icon" /> Invert
        </MenuItem>
      )}
      {showIgnore && (
        <MenuItem onClick={onActionClick("ignore")}>
          <XCircleIcon className="menu-icon" /> Skip
        </MenuItem>
      )}
    </MuiMenu>
  )
}
export default Menu
