import { useContext } from "react";
import { DemoContext } from "../context/DemoContext";

const DemoBadge = () => {
  const demoContext = useContext(DemoContext);
  if (!demoContext?.isDemo) return null;

  return <div style={{ background: "yellow", padding: "5px" }}>Demo Mode</div>;
};

export default DemoBadge;
