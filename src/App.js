import { Routes, Route } from "react-router-dom";
import WarrantyRegister from "./WarrantyRegister";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        {/* Default route (manual registration if needed) */}
        <Route path="/" element={<WarrantyRegister />} />

        {/* QR route */}
        <Route path="/warranty/:token" element={<WarrantyRegister />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
