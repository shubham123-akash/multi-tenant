import { Toaster } from "react-hot-toast";
import Body from "./components/Body";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Body />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
