// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React from "react";
import ContactFormContent from "./pages/Contact";
import LoginFormContent from "./pages/Login/Login";
import { useModal } from "./Appwrapper";

function App() {
  const { openModal } = useModal();

  const handleOpenModal = (type) => {
    let title = "";
    let body = null;

    switch (type) {
      case "login":
        title = "Login";
        body = <LoginFormContent />;
        break;
      case "contact":
        title = "Contact";
        body = <ContactFormContent />;
        break;
      default:
        title = "Unknown";
        body = <p>No content found.</p>;
    }

    openModal({
      title,
      body,
      showConfirm: false,
    });
  };
  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="flex gap-4 p-4">
            <li>
              <button onClick={() => handleOpenModal("contact")} className="text-blue-600 underline">
                Contact
              </button>
              </li>
            <li>
              <button onClick={() => handleOpenModal("login")} className="text-blue-600 underline">
                Login
              </button>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
