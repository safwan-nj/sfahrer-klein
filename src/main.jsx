import App from './App.jsx'
import './main.css'
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <div className="app-container">
    <App />
  </div>
);

