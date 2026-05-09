import { useContext } from "react";
import { DemoContext } from "../context/DemoContext";

const Login = () => {
  const demoContext = useContext(DemoContext);

  const handleTryDemo = () => {
    demoContext?.setDemo(true);
    // Navigate to demo dashboard or home
  };

  return (
    <div>
      {/* ...existing login form code... */}
      <button onClick={handleTryDemo}>Try Demo</button>
    </div>
  );
};

export default Login;
