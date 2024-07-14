import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Survey from "./components/Survey";
import Responses from "./components/Responses";
import axios from "axios";

function App() {
  return (
    <>
      <div className="flex flex-col gap-10 bg-zinc-100 justify-center items-center h-[1000px]">
        <Survey />
      </div>
    </>
  );
}

export default App;
