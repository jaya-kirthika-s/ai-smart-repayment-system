import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Next from "./Next";
import Viewuser from "./Viewuser";
import Checkuser from "./Checkuser";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/reg" element={<Register />} />
      <Route path="/next" element={<Next />} />
      <Route path="/viewuser" element={<Viewuser />} />
      <Route path="/checkuser" element={<Checkuser />} />
    </Routes>
  );
};

export default App;
