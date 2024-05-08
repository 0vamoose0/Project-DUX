import React from "react";
import location from "react-dom";

const ContactList = ({ contacts, updateContact, updateCallback }) => {
  //Define the contact with contact id.
  const onDelete = async (id) => {
    const options = {
      method: "DELETE",
    };
    const response = await fetch(
      `http://127.0.0.1:5000/delete_contact/${id}`,
      options
    );
    console.log(response.status);

    if (response.status !== 200) {
      throw new Error("Failed to delete contact");
    }
  };

  return (
    <div className="outline outline-2 outline-red-200 contianer mx-80 p-2 flex flex-col">
      <h2 className="font-bold text-2xl">Contacts</h2>
      <table className="outline outline-2 outline-purple-500 table-auto bg-gray-100">
        <thead>
          <tr>
            <th className="m-10">First Name</th>
            <th className="ml-24">Last Name</th>
            <th className="m-10">Email</th>
            <th className="m-10">Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="m-10">{contact.firstName}</td>
              <td className="m-10">{contact.lastName}</td>
              <td className="m-10">{contact.email}</td>
              <td className="m-10">
                <button onClick={() => updateContact(contact)}>Update</button>
                <button
                  onClick={() => {
                    onDelete(contact.id);
                    window.location.reload();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
