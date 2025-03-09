import React, { useState } from "react";
import "./navbar.css";

interface NavbarProps {
  onSearch: (query: string) => void;
  onLogOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLogOut }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery); // Trigger search callback
  };

  return (
    <div className="search-bar-container">
      <div className="search-input">
        <span className="search-icon">
          <img src="/icons/search.png" alt="search icon" />
        </span>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search Project"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>
      </div>
      <button className="filter-button" onClick={onLogOut}>
        Logout
      </button>
    
    </div>
  );
};

export default Navbar;
