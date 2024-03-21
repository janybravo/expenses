import { D3H, Hierarchy } from "./types"

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

export const expensesHierarchy = toD3Hierarchy({ root: expenses })
