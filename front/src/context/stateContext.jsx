import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function ContextProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [coursesCreated, setCoursesCreated] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [provider, setProvider] = useState(null);

  return (
    <AppContext.Provider
      value={{
        address,
        setAddress,
        activeCourse,
        setActiveCourse,
        coursesCreated,
        setCoursesCreated,
        provider,
        setProvider,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
