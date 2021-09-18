import "./style.css";
import bs58 from "bs58";
import React, { useState } from "react";

import AccountDetailsCard from "./AccountDetailsCard";
import TxDetailsCard from "./TxDetailsCard";

export type Query = { searchValue?: string; searchType?: string };

export default function SearchCard() {
  const [query, setQuery] = useState<Query>();

  function handleChange(event: any) {
    const { value } = event.target;
    console.log(value);
    setQuery({ searchValue: value });
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log(event.target);
    if (query?.searchValue !== undefined) {
      const decoded = bs58.decode(query?.searchValue);
      if (decoded.length === 32) {
        setQuery({ searchValue: query?.searchValue, searchType: "address" });
        console.log(decoded);
      } else if (decoded.length === 64) {
        setQuery({ searchValue: query?.searchValue, searchType: "signature" });
        console.log(decoded);
      } else {
        console.log("Input not correct");
      }
      event.preventDefault();
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            className="input"
            type="text"
            value={query?.searchValue}
            onChange={handleChange}
          />
        </label>
        <input className="submit" type="submit" value="Submit" />
      </form>

      {query?.searchType === "signature" && <TxDetailsCard query={query}/>}

      {query?.searchType === "address" && <AccountDetailsCard query={query} />}
    </>
  );
}
