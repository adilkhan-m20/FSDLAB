import React, { useState } from "react";

function Employee() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");

  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");

  function changeDetails() {
    setName(newName);
    setAddress(newAddress);
  }

  return (
    <div>
      <h3>Employee Details</h3>
      <h4>Initial Details</h4>
      Name: <input onChange={(e) => setName(e.target.value)} />
      <br />
      Address: <input onChange={(e) => setAddress(e.target.value)} />
      <br />
      Company: <input onChange={(e) => setCompany(e.target.value)} />
      <br />
      <br />
      <h4>Changed Details</h4>
      New Name: <input onChange={(e) => setNewName(e.target.value)} />
      <br />
      New Address: <input onChange={(e) => setNewAddress(e.target.value)} />
      <br />
      <br />
      <button onClick={changeDetails}>CHANGE</button>
      <hr />
      <p>Name: {name}</p>
      <p>Address: {address}</p>
      <p>Company: {company}</p>
    </div>
  );
}

export default Employee;
