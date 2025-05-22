import React, { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (postcode: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [postcode, setPostcode] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(postcode.trim().toUpperCase());
    setPostcode("");
  };

  return (
    <div className="search-bar" role="search">
      {" "}
      <label htmlFor="postcode-search" className="sr-only">
        Enter postcode
      </label>{" "}
      <input
        type="text"
        id="postcode-search"
        placeholder="Enter postcode"
        value={postcode}
        onChange={handleInputChange}
        aria-label="Enter postcode for store search"
      />
      <button
        onClick={handleSearchClick}
        aria-label="Search stores by postcode"
      >
        Search
      </button>{" "}
    </div>
  );
};

export default SearchBar;
