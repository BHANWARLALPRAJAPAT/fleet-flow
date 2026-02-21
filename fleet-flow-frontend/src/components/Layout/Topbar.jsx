import { useLocation } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";

const pageTitles = {
  "/": "Command Center",
  "/vehicles": "Vehicle Registry",
  "/drivers": "Driver Management",
  "/trips": "Trip Management",
  "/maintenance": "Maintenance Logs",
  "/fuel-logs": "Fuel Logs",
  "/expenses": "Expense Tracking",
  "/reports": "Analytics & Reports",
};

export default function Topbar() {
  const location = useLocation();

  const pageTitle =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(
      ([path]) => location.pathname.startsWith(path) && path !== "/"
    )?.[1] ||
    "FleetFlow";

  // Placeholder user info — will be replaced by AuthContext in F2
  const userRole = localStorage.getItem("role") || "MANAGER";
  const userEmail = localStorage.getItem("email") || "user@fleetflow.com";
  const userName = userEmail.split("@")[0];
  const initials =
    userName
      .split(".")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "FF";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__page-title">{pageTitle}</h1>
      </div>

      <div className="topbar__right">
        <button className="topbar__notification-btn" title="Notifications">
          <Bell size={20} />
          <span className="topbar__notification-dot" />
        </button>

        <div className="topbar__user">
          <div className="topbar__avatar">{initials}</div>
          <div className="topbar__user-info">
            <span className="topbar__user-name">{userName}</span>
            <span className="topbar__user-role">{userRole}</span>
          </div>
        </div>

        <button className="topbar__logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
