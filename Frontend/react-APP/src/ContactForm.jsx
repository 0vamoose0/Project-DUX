import { useState } from "react";

const ContactForm = ({ existingContact = {}, updateCallback }) => {
  const [firstName, setFirstName] = useState(existingContact.firstName || "");
  const [lastName, setLastName] = useState(existingContact.lastName || "");
  const [email, setEmail] = useState(existingContact.email || "");

  const updating = Object.entries(existingContact).length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstName,
      lastName,
      email,
    };

    const url =
      "http://127.0.0.1:5000/" +
      (updating ? "update_contact" : "create_contact") +
      (updating ? `/${existingContact.id}` : "");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      alert(response.status);
      const data = await response.json();
    } else {
      updateCallback();
    }
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-end pr-[20%] p-16 container mx-auto px-5 font-bold text-white"
    >
      <div>
        <label htmlFor="firstName" className="pr-4">
          First Name:
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="bg-slate-200 ring-2 ring-gray-500 rounded-md text-black"
        ></input>
      </div>

      <div className="pt-2">
        <label htmlFor="lastName" className="pr-4">
          Last Name:
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="bg-slate-200 ring-2 ring-gray-500 rounded-md text-black"
        ></input>
      </div>

      <div className="pt-2">
        <label htmlFor="email" className="pr-4">
          email:
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-200 ring-2 ring-gray-500 rounded-md text-black"
        ></input>
      </div>
      <button
        type="submit"
        className="font-base bg-lime-400 border-2 border-slate-400 rounded-xl mt-4 px-2 py-3 transition-all duration-300 hover:scale-110 hover:outline hover:outline-1 hover:text-black"
      >
        Create Contact
      </button>
    </form>
  );
};

export default ContactForm;
