import React, { createContext, useState } from 'react';

type OwnerMode = 'personal' | 'organization';

interface OwnerModeContextType {
  ownerMode: OwnerMode;
  setOwnerMode: (ownerMode: OwnerMode) => void;
}

export const OwnerModeContext = createContext<OwnerModeContextType>({
  ownerMode: 'personal',
  setOwnerMode: () => { },
});

export const OwnerModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [ownerMode, setOwnerMode] = useState<OwnerMode>('personal');
  return (
    <OwnerModeContext.Provider value={{ ownerMode, setOwnerMode }}>
      {children}
    </OwnerModeContext.Provider>
  );
};