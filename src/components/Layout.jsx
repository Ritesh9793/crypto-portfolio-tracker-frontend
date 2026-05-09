import DemoBadge from "./DemoBadge";

const Layout = ({ children }) => {
  return (
    <div>
      <DemoBadge />
      <nav>
        {/* Add navigation links here, e.g., to Exchange, Settings, Profile */}
        <a href="/exchange">Exchange</a>
        <a href="/settings">Settings</a>
        <a href="/profile">Profile</a>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
