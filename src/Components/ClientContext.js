// ClientContext.js
import React, { createContext, useContext, useState } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([
    {
      name: 'John Doe',
      company: 'ABC Company',
      city: 'New York',
      email: 'email@email.com',
    },
    {
      name: 'Jane Doe',
      company: 'XYZ Company',
      city: 'Los Angeles',
      email: 'email1@email.com',
    },
  ]);

  const updateClients = (newClient) => {
    setClients((prevClients) => [...prevClients, newClient]);
  };

  const deleteClients = (index) => {
    const remaianingClients = [...clients];
    // Remove the client at the specified index
    remaianingClients.splice(index, 1);
    setClients(remaianingClients);
  }

  return (
    <ClientContext.Provider value={{ clients,setClients, updateClients, deleteClients }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
