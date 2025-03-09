import React, { useState } from "react";
import "./navbar.css";
import { LogOut } from "lucide-react";

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
        <span className="filter-btn-content">Logout</span>
        <span className="logout-icon"><LogOut height={20} width={20}/></span>
      </button>
    
    </div>
  );
};

export default Navbar;
