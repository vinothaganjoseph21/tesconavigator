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
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter postcode"
        value={postcode}
        onChange={handleInputChange}
      />
      <button onClick={handleSearchClick}>Search</button>
    </div>
  );
};

export default SearchBar;
