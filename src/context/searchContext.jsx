import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchContextProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook للاستخدام
export const useSearch = () => useContext(SearchContext);
