import { RouterProvider } from "react-router-dom";
import { Router } from "./routes/Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={Router} />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
