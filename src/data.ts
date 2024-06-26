import { Hierarchy } from "./types"
import { toD3Hierarchy } from "./utils"

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

export const expensesHierarchy = toD3Hierarchy({ root: expenses })
