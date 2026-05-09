import { createContext, useState } from "react";

export const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  const [isDemo, setIsDemo] = useState(false);

  return (
    <DemoContext.Provider value={{ isDemo, setDemo: setIsDemo }}>
      {children}
    </DemoContext.Provider>
  );
};
