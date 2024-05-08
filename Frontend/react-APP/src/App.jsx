import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";
import ContactRemove from "./ContactRemove";

function App() {
  // Use state:
  // In the following case, the variable "contacts" has been set to "[]"
  // A new function "setContacts" is also set, where it takes a parameter and apply it to the "contacts" variable when called.
  const [contacts, setContacts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentContact, setCurrentContact] = useState({});

  // Use effect:
  // In the following case, the function that is getting executed is the "fetchContacts()"
  // A dependency array is stored in the square bracket, where the code will run at least once regardless of whether the condition is fulfiled or not.
  // A dependency array may not be necessary.
  // Can also include an optional return function.
  useEffect(() => {
    fetchContacts();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();

    setContacts(data.contacts);

    console.log(data.contacts);
  };
  // The following code is the layout of the webpage.
  // Modal is a pop-up window that appears when the "Create New Contact" button is clicked.
  // To open the modal, the function "openCreateModal" is called.
  // To close the modal, the function "closeModal" is called.

  const openEditModal = (contact) => {
    if (isModalOpen) return;
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    fetchContacts();
    closeModal();
  };

  return (
    <div className="outline outline-2 outline-blue-600 text-center">
      <ContactList
        contacts={contacts}
        updateContact={openEditModal}
        updateCallback={onUpdate}
      />
      <button onClick={openCreateModal}>Create New Contact</button>
      {isModalOpen && (
        <div className="bg-gray-400 inline-flex fixed left-[50%] -translate-x-1/2 w-[40rem] h-[15rem] top-[50%] -translate-y-1/2 z-10 rounded-xl">
          <span
            onClick={closeModal}
            className="text-white p-3 px-5 mx-0 text-2xl h-fit relative top-0 left-0 bg-lime-400 cursor-pointer rounded-tl-xl rounded-br-xl transition-all duration-300 hover:scale-125 hover:outline hover:outline-1 hover:text-black"
          >
            &times;
          </span>
          <ContactForm
            existingContact={currentContact}
            updateCallback={onUpdate}
          />
        </div>
      )}
    </div>
  );
}

export default App;
