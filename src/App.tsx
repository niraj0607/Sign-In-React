import React, { useState, useEffect, useRef, useCallback   } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCallbackResponse = (response: any) => {
    console.log("Encoded JWT ID token: " + response.credential);
    closeModal();
  };

  useEffect(() => {
    (window as any).google.accounts.id.initialize({
      client_id: "695051548996-74f2sq1fil098b34lddqrmq2t8qlflr2.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        (window as any).google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large" }
        );
      }, 200);
    }

    return () => clearTimeout(timeoutId);
  }, [isModalOpen]);

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('click', checkIfClickedOutside);

    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, [closeModal]);

  return (
    <div className='App'>
      <button onClick={openModal}>Open Sign In</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        contentLabel="Sign In Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div>
          <h2>Sign In with Google</h2>
          <div id="signInDiv"></div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
