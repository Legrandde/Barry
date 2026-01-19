import { RouterProvider } from "react-router-dom"
import { Router } from "./routes/Routes"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={Router} />
    </ThemeProvider>
  )
}

export default App
