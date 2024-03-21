import { D3H, Hierarchy } from "./types"

export const toD3Hierarchy = (data: Hierarchy): D3H => {
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
