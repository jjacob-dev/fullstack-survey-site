import { Piechart } from "./charts/Piechart";
import { Barchart } from "./charts/Barchart";
import { Gradient } from "./charts/Gradient";

const Responses: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-medium">View your results</h1>
        <hr className="w-64 h-[2px] mx-auto my-4 bg-green-600 border-0 rounded justify-left"></hr>
      </div>
      <div className="flex flex-col">
        <div>
          <Gradient />
        </div>
        <div className="flex">
          <Piechart />
          <Barchart />
        </div>
      </div>
    </div>
  );
};

export default Responses;
