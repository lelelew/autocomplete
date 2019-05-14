import React from "react";
import "./App.css";
import Products from "./products.json";
import Autocomplete from "./Autocomplete";
import { Product } from "./types";

function App() {
  function onSelect(product: Product) {
    alert(`You selected ${product.name}`);
  }

  return (
    <div className="App">
      <div>Begin typing to search for a financial institution</div>
      <div className="search">
        <Autocomplete
          products={Products.products}
          placeholder="e.g. Bank of America"
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

export default App;
