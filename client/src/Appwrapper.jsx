// Thuc 
import { useState, createContext, useContext } from "react";
import Modal from "./components/Modal";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export default function AppWrapper({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    body: null,
  });

  const openModal = ({ title, body }) => {
    setModalContent({ title, body });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.body}
      </Modal>
    </ModalContext.Provider>
  );
}
