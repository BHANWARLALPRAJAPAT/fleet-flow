import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Users,
  Truck,
  Wrench,
  Fuel,
  DollarSign,
  BarChart3,
  ChevronLeft,
} from "lucide-react";

const mainLinks = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/vehicles", label: "Vehicles", icon: <Car size={20} /> },
  { to: "/drivers", label: "Drivers", icon: <Users size={20} /> },
  { to: "/trips", label: "Trips", icon: <Truck size={20} /> },
];

const operationLinks = [
  { to: "/maintenance", label: "Maintenance", icon: <Wrench size={20} /> },
  { to: "/fuel-logs", label: "Fuel Logs", icon: <Fuel size={20} /> },
  { to: "/expenses", label: "Expenses", icon: <DollarSign size={20} /> },
];

const insightLinks = [
  { to: "/reports", label: "Reports", icon: <BarChart3 size={20} /> },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const renderLink = (link) => {
    const isActive =
      link.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(link.to);

    return (
      <NavLink
        key={link.to}
        to={link.to}
        className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
        title={collapsed ? link.label : undefined}
      >
        <span className="sidebar__link-icon">{link.icon}</span>
        <span className="sidebar__link-label">{link.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo-icon">🚛</div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">FleetFlow</span>
          <span className="sidebar__brand-tagline">Fleet Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <span className="sidebar__section-label">Main</span>
        {mainLinks.map(renderLink)}

        <span className="sidebar__section-label">Operations</span>
        {operationLinks.map(renderLink)}

        <span className="sidebar__section-label">Insights</span>
        {insightLinks.map(renderLink)}
      </nav>

      {/* Collapse toggle */}
      <div className="sidebar__footer">
        <button className="sidebar__toggle" onClick={onToggle}>
          <ChevronLeft size={18} className="sidebar__toggle-icon" />
          <span className="sidebar__toggle-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
