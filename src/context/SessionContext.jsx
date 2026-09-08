import React, { createContext, useContext, useState } from 'react';

import Session from '../models/Session';


const SessionContext = createContext();
const useSession = () => useContext(SessionContext);

const SessionProvider = ({ children }) => {
  // State
  const [ session, setSession ] = useState(new Session());

  // Render
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};


export {
  SessionProvider,
  useSession
};