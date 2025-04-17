// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React from "react";
import ContactFormContent from "./pages/Contact";
import LoginFormContent from "./pages/Login/Login";
import { useModal } from "./Appwrapper";
import Footer from "./components/Footer";
import Header from "./components/Header";

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
        <Header />

        <Routes>
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
