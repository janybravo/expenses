type KVObject<T> = {
  [key: string]: T
}
export type Hierarchy = KVObject<Hierarchy | number>[]
export type FinalBranch = KVObject<number>[]

export const expenses: Hierarchy = [
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
        X: [{ y: 111.1 }],
      },
    ],
  },
]
