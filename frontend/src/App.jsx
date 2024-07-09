import { useState } from "react";
import Canvas from "./Canvas";

function App() {
  const [analyzerOn, setAnalyzerOn] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const calculations = [
    "1 + 1 = 2",
    "2 + 2 = 4",
    "3 x 12 = 36",
    "4 / 2 = 2",
    "5 - 3 = 2",
    "9.5 x 3 = 28.5",
    "4 + 2 = 6",
  ];

  async function predictDigit(data) {
    const prediction = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await prediction.json();
    console.log(result);
    setPrediction(result);
  }

  const toggleAnalyzer = () => {
    setAnalyzerOn(!analyzerOn);
  };

  return (
    <>
      <div className="flex flex-col p-5 w-full justify-center items-center gap-5  md:p-0 md:flex-row md:h-screen">
        <div className="flex flex-col w-full mt-10 md:w-[500px] h-[500px] border border-gray-400 rounded-sm text-white bg-gray-800 shadow-lg md:flex md:mt-0">
          <div className="flex-none p-2 border-t h-12 border-gray-600 gap-5 bg-gray-700">
            {prediction && (
              <>
                <span>Number: {prediction.prediction}</span>{" "}
                <span>Confidence: {prediction.probability}</span>
              </>
            )}
          </div>
          <div className="flex  flex-grow  w-full h-full bg-black">
            <Canvas
              lineWidth={5}
              height={500 - 50}
              strokeStyle="white"
              callback={predictDigit}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center w-full md:w-[200px] md:h-[500px] border border-gray-400 rounded-sm text-white bg-gray-800 shadow-lg">
          <div className="flex-1 w-full">
            <label
              htmlFor="toggle"
              className="flex flex-col justify-center items-center gap-5 w-full cursor-pointer"
            >
              <div className="relative mt-5">
                <input
                  type="checkbox"
                  id="toggle"
                  checked={analyzerOn}
                  onChange={toggleAnalyzer}
                  className="sr-only"
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    analyzerOn
                      ? "translate-x-full bg-green-400"
                      : "translate-x-0 bg-red-400"
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-gray-200">
                Analyzer
                {analyzerOn ? (
                  <span className="text-green-500 font-bold"> ON</span>
                ) : (
                  <span className="text-red-500 font-bold"> OFF</span>
                )}
              </span>
            </label>
          </div>
          <div>
            {analyzerOn && (
              <div className="h-[300px] text-center overflow-y-auto">
                {calculations.map((calculation, index) => (
                  <div
                    className="p-2 b border-b-gray-700 border-b-[1px]"
                    key={index}
                  >
                    {calculation}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm h-[100px] border border-gray-600 bg-gray-700 p-2">
            Turn on the analyzer to automatically perform calculations as you
            write.
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
