//Coder : Dat

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// viet hien thi hello world
function Booking() {
  return (
    <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
      <Link to="/petVet">
        <button>Vets</button>
      </Link>
      <Link to="/petGrooming">
        <button>Grooming</button>
      </Link>
      <Link to="/petEvent">
        <button>Events & Workshop</button>
      </Link>
      <Link to="/petAdvice">
        <button>Advice</button>
      </Link>
    </div>
  );
}

export default Booking;
