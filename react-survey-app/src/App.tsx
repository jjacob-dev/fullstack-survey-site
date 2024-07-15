import "./App.css";
import Survey from "./components/Survey";

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
