import { LibraryClient } from './api/library-client';
import { createContext, ReactNode, useContext } from 'react';

const ApiContext = createContext(new LibraryClient())

export default function ApiProvider({children}: {children: ReactNode}) {
  const apiClient = new LibraryClient();
  return (
    <ApiContext.Provider value={apiClient}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi(){
  return useContext(ApiContext);
}