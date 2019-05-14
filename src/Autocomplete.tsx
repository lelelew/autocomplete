import React, { ChangeEvent, useState } from "react";
import { Product } from "./types";
import "./Autocomplete.css";

interface Props {
  // List of products that populates the results a user searches for
  products: Array<Product>;
  // Placeholder text in search text area providing an example of a financial institution a user can search for
  placeholder?: string;
  // Event handler providing functionality for mouse clicks and/or pressing enter on a product
  onSelect: (product: Product) => void;
}

/**
 * Autocomplete component allows the user to search for matches
 * in the provided set of options using partial matching and
 * keyboard navigation. Set an `onSelect` function to receive
 * the option the user chooses.
 *
 * @param props {AutocompleteProps} render props for the autocomplete component
 */
function Autocomplete(props: Props) {
  const { products, placeholder, onSelect } = props;
  // List of complete or partial matches to the provided list of products from user search term
  const [matches, setMatches] = useState();
  // Item from returned matches that user has selected based on either keyboard or mouse input
  const [selectedIndex, setSelectedIndex] = useState();
  // String that a user has typed in the search text area
  const [searchText, setSearchText] = useState("");

  // This function handles all changes in the search box input
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue: string = event.target.value;
    // Removes special characters from search text (e.g. \@$%)
    const value = rawValue.replace(/[^a-zA-Z0-9 ]/g, "");

    // Resets matches if user deletes search term
    if (value === "") {
      setMatches([]);
      setSearchText(value);
      return;
    }

    // This regexValue function allows a user to search for a product with the words in any order.
    // example: "express american" will match "american express" as a result.
    let phrase = "(" + value.trim().replace(/ /g, "|") + ")";
    let words: number = value.trim().split(" ").length;
    let newPhrase: string = "";

    for (let i = 0; i < words; i++) {
      newPhrase += phrase;
      if (i < words - 1) {
        newPhrase += ".*";
      }
    }

    const searchExpression = new RegExp(newPhrase, "i");
    const newMatches: Array<Product> = [];

    // Limits matches to 10 per design guidelines.
    // Also removes text after "-" (product type) so that all banks are not returned as
    // a result of searching for any name that includes "bank" such as "bank of america".
    for (let i = 0; i < products.length && newMatches.length < 10; i++) {
      let productName = products[i].name.split("-")[0];
      if (searchExpression.test(productName)) {
        newMatches.push(products[i]);
      }
    }
    setMatches(newMatches);
    setSearchText(value);
  }

  // Allows user to use keyboard up/down arrows & enter key to select and pick a financial institution
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    let newIndex: number | undefined = selectedIndex;
    switch (event.key) {
      case "ArrowDown":
        if (newIndex === undefined) {
          newIndex = 0;
        } else if (newIndex < matches.length - 1) {
          newIndex++;
        }
        break;
      case "ArrowUp":
        if (newIndex === undefined) {
          newIndex = matches.length - 1;
        } else if (newIndex > 0) {
          newIndex--;
        }
        break;
      case "Enter":
        if (newIndex !== undefined) {
          onSelect(matches[newIndex]);
        }
        break;
      default:
        newIndex = undefined;
        break;
    }
    setSelectedIndex(newIndex);
  }

  // Allows user to use mouse input to select & pick a financial institution
  function onClick(product: Product) {
    if (onSelect) {
      onSelect(product);
    }
  }

  // Emphasizes the difference between the user search input and the returned matches,
  // as per design guidelines.
  // Turns the search phrase into a regex and returns an object that changes the html
  // class for the matching part of a search phrase.
  function boldDifference(name: string) {
    let phrase = "(" + searchText.trim().replace(/ /g, "|") + ")";
    const __html = name.replace(
      new RegExp(phrase, "ig"),
      `<span class="matchedText">$1</span>`
    );
    return { __html };
  }

  return (
    <div className="autocomplete">
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        value={searchText}
        autoFocus
      />
      <div className="suggestions">
        {matches &&
          matches.map((product: Product, index: number) => {
            const className =
              selectedIndex === index
                ? "content-item-selected"
                : "content-item";
            return (
              <div
                className={className}
                key={index}
                onClick={event => onClick(product)}
              >
                <span
                  className="product-name"
                  dangerouslySetInnerHTML={boldDifference(product.name)}
                />
                <span className="product-type">
                  {product.type.replace(/_/, " ")}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Autocomplete;
