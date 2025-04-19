//Coder : Dat

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Tạo ra array chứa object của 4 thẻ trang
const cards = [
  { title: "Vets", path: "/petVet", imgA: "/img/booking/active/petVet-a.png" },
  { title: "Grooming", path: "/petGrooming", imgA: "/images/grooming.jpg" },
  { title: "Events & Workshop", path: "/petEvent", imgA: "/images/events.jpg" },
  { title: "Advice", path: "/petAdivce", imgA: "/images/advice.jpg" },
];

// viet hien thi hello world
function Booking() {
  return (
    <div>
      <nav>
        <ul className="nav nav-tabs ">
          <li>
            <button className="card ">
              <img
                src="/img/booking/active/petVet-a.png"
                alt="vet"
                className="card-img-top"
                style={{ width: "180px", height: "180px" }}
              ></img>
              <div className="card-body">
                <h5 className="card-title">Vets</h5>
                <p className="card-text">Find the best vet for your pet.</p>
                <Link to="/petVet" className="btn btn-primary">
                  Book Now
                </Link>
              </div>
            </button>
          </li>

          <li>
            <button className="card ">
              <img
                src="/img/booking/active/petVet-a.png"
                alt="vet"
                className="card-img-top"
                style={{ width: "180px", height: "180px" }}
              ></img>
              <div className="card-body">
                <h5 className="card-title">Vets</h5>
                <p className="card-text">Find the best vet for your pet.</p>
                <Link to="/petVet" className="btn btn-primary">
                  Book Now
                </Link>
              </div>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Booking;
