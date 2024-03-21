import type * as d3 from "d3"

export type Hierarchy = Record<string, Hierarchy[] | number>
export type D3H = {
  name: string
  children?: D3H[]
  value?: number
  factor?: number
  x?: number
  y?: number
}

export interface OnClick {
  (e: MouseEvent, node: d3.HierarchyNode<D3H>): void
}
