// Thuc 
import React, { useState, createContext, useContext } from "react";
import Modal from "./components/Modal";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export default function AppWrapper({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    body: null,
    showConfirm: false,
    onConfirm: null,
  });

  const openModal = ({ title, body, showConfirm = false, onConfirm = null }) => {
    setModalContent({ title, body, showConfirm, onConfirm });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (modalContent.onConfirm) modalContent.onConfirm();
          closeModal();
        }}
        title={modalContent.title}
        showConfirm={modalContent.showConfirm}
      >
        {modalContent.body}
      </Modal>
    </ModalContext.Provider>
  );
}
