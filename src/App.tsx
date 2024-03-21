import { useReducer } from "react"
import "./app.css"
import ExpandableList from "./expendableList"
import { expensesHierarchy } from "./data"

const App = () => {
  useReducer(
    (state) => {
      return state
    },
    {} as Record<string, boolean>,
  )

  return (
    <div className="plot">
      <ExpandableList data={expensesHierarchy} onClick={console.log} />
    </div>
  )
}
export default App
