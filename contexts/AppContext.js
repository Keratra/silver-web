import { useState, useContext, createContext } from 'react';

const AppContext = createContext();
const AppUpdateContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function useAppUpdate() {
  return useContext(AppUpdateContext);
}

const initialState = {
  token: '',
  userType: '',
  categoryLabels: [],
};

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(initialState);

  return (
    <AppContext.Provider value={appState}>
      <AppUpdateContext.Provider value={setAppState}>
        {children}
      </AppUpdateContext.Provider>
    </AppContext.Provider>
  );
}
