import { Search, Filter } from "lucide-react";

export default function FilterBar({ onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <Filter size={16} color="#94a3b8" />
        <span className="filter-label">Type</span>
        <select name="type" className="filter-select" onChange={handleChange}>
          <option value="ALL">All Vehicles</option>
          <option value="TRUCK">Trucks</option>
          <option value="VAN">Vans</option>
          <option value="BIKE">Bikes</option>
        </select>
      </div>

      <div className="filter-group">
        <span className="filter-label">Status</span>
        <select name="status" className="filter-select" onChange={handleChange}>
          <option value="ALL">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
        </select>
      </div>

      <div className="filter-group" style={{ flex: 1, borderRight: "none" }}>
        <Search size={16} color="#94a3b8" />
        <input
          type="text"
          name="search"
          placeholder="Search region or driver..."
          className="filter-select"
          style={{ width: "100%" }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
