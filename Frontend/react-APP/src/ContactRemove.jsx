import React, { useState } from "react";

function ContactRemove() {
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");

  const handleRemove = () => {
    // Make an API call to remove the user from the database using the customerId
    // Replace the API_URL with your actual API endpoint
    fetch("http://127.0.0.1:5000/delete_contact", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId }),
    })
      .then((response) => {
        if (response.ok) {
          // User removed successfully
          setError("");
        } else {
          // User not found or other error occurred
          setError("User not found");
        }
      })
      .catch((error) => {
        // Handle any network or server errors
        setError("An error occurred");
      });
  };

  return (
    <div>
      <h1>Remove User</h1>
      <input
        type="text"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        placeholder="Enter Customer ID"
      />
      <button onClick={handleRemove}>Remove</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ContactRemove;
