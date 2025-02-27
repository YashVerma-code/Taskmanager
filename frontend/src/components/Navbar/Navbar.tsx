import React from "react";
import "./navbar.css";
const Navbar: React.FC = () => {
  return (
    <div className="search-bar-container">
      <div className="search-input">
        <span className="search-icon">
          <img src="/icons/search.png" alt="" />
        </span>
        <form action="">
          <input type="text" placeholder="Search Project" />
        </form>
      </div>
      <button className="filter-button">
        <span className="filter-icon">
          <img src="/icons/filter.png" alt="" />
        </span>
        <span className="filter-text">Filter</span>
        
        <span className="arrow-down">
          <img src="/icons/arrow-down.png" alt="" />
        </span>
      </button>
    </div>
  );
};

export default Navbar;
