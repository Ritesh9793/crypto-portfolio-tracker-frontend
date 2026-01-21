import { createContext, useState } from "react";

export const DemoContext = createContext(undefined);

export const DemoProvider = ({ children }) => {
  const [isDemo, setIsDemo] = useState(false);
  const mockData = { holdings: [{ crypto: "BTC", amount: 1.0 }], pnl: 1000.0 }; // Mock

  return (
    <DemoContext.Provider value={{ isDemo, setDemo: setIsDemo, mockData }}>
      {children}
    </DemoContext.Provider>
  );
};
