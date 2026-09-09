import { createContext, useContext, useState } from 'react';

import Settings from '../models/Settings';


const SettingsContext = createContext();
const useSettings = () => useContext(SettingsContext);

const SettingsProvider = ({ children }) => {
  const [ settings, setSettings ] = useState(new Settings());

  /*
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };
  */

  // Render
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};


export {
  SettingsProvider,
  useSettings
};