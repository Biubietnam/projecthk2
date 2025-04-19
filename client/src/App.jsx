// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GearShop from "./pages/shop/gearshop";
import Booking from "./pages/Booking";
import PetVet from "./pages/Booking/petVet";
import PetGrooming from "./pages/Booking/petGrooming";
import PetEvents from "./pages/Booking/petEvent";
import PetAdvice from "./pages/Booking/petAdvice";

function App() {
  return (
    <Router>
      <div className="App font-winky">
        <Header />

        <Routes>
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/gearshop" element={<GearShop />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/petVet" element={<PetVet />} />
          <Route path="/petGrooming" element={<PetGrooming />} />
          <Route path="/petEvent" element={<PetEvents />} />
          <Route path="/petAdvice" element={<PetAdvice />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
