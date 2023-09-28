import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  return (
    <div className="bg-white fixed left-0 z-[9999] w-[200px] rounded-4xl px-4 py-2 shadow-xl top-0">
      <span className="text-red-400 font-bold  text-base">page already visited</span>
    </div>
  );
}
