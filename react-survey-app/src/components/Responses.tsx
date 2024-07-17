import { Piechart } from "./charts/Piechart";
import { Barchart } from "./charts/Barchart";
import { Gradient } from "./charts/Gradient";
import { useState, useEffect } from "react";
import axios from "axios";

const Responses: React.FC = () => {
  const [nameData, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recent = await axios.get(
          "https://d343wjktlr3212.cloudfront.net/last-entry/name"
        );

        setRecent(recent.data.name);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-medium">
          Hey {nameData}! View your results
        </h1>
        <hr className="w-64 h-[2px] mx-auto my-4 bg-green-600 border-0 rounded justify-left"></hr>
      </div>
      <div className="flex flex-col">
        <div>
          <Gradient />
        </div>
        <div className="flex flex-col md:flex-row">
          <Piechart />
          <Barchart />
        </div>
      </div>
    </div>
  );
};

export default Responses;
