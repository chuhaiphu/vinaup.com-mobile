import React, { createContext, useContext, useState } from 'react';

type OwnerMode = 'personal' | 'organization';

interface OwnerModeContextType {
  ownerMode: OwnerMode;
  setOwnerMode: (ownerMode: OwnerMode) => void;
}

const OwnerModeContext = createContext<OwnerModeContextType>({
  ownerMode: 'personal',
  setOwnerMode: () => { },
});

export function useOwnerModeContext() {
  return useContext(OwnerModeContext);
}

export const OwnerModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [ownerMode, setOwnerMode] = useState<OwnerMode>('personal');
  return (
    <OwnerModeContext value={{ ownerMode, setOwnerMode }}>
      {children}
    </OwnerModeContext>
  );
};