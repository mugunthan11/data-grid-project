import React from "react";
import DataGrid from "./components/Grid.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
        <h1 style={{ margin: 0, color: "red" }}>Data grid Task - Animaker</h1>
      </header>
      <DataGrid />
    </div>
  );
}

export default App;
