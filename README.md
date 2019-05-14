_Thank you for the opportunity to work on this project._

# Introduction

This project was written loosely based on the user experience within Personal Capital's UI for searching for a financial institution when linking a new account.

As soon as you begin typing, matching product results will begin to show on the page.

Selecting a product (either with a mouse click or pressing enter) currently sends an alert showing which product was selected. This is based on the functionality of Personal Capital's search - further details about the feature would be needed before deciding how the URLs of the products should be used (if at all).

# Requirements

- Single page app
- Allow users to search for a financial institution using an autocomplete style search box
- When the user enters text into the search box, the app should use the provided data feed to search product names for the term the user entered into the search box
- Results should be returned & displayed as a "drop down" of the search box
- UX should be a consideration
- Follow responsive layout
- Any libraries/tools are allowed except for libraries that implement autocomplete directly

# Design Choices

- I started with Create React App and wrote a custom component: `Autocomplete.tsx`.
- Though it's not a very complex project, I decided to use TypeScript to keep the code organized and so that the project could be easily expanded upon.
- I wanted to support searching for names of products out of order, e.g. "schwab charles" would also return "charles schwab" as an option.
- There is no debouncing of the input since the performance seems to be able to keep up with a person typing.
- I considered using a library such as Material-UI but decided to keep things simple and focus on functionality.
- No additional libraries were used.

# Features

The following design guidelines were taken into consideration:

- Style Auxiliary Data Differently: Addressed in the CSS file with...

  ```css
  .product-type {
    font-size: 10px;
    color: rgb(134, 126, 126);
    margin-left: 5px;
    text-align: right;
  }
  ```

- Avoid Scrollbars & Keep the List Manageable:
  Results are limited to the first 10 matches. This was done by setting the limit in this for loop:

  ```js
  for (let i = 0; i < products.length && newMatches.length < 10; i++) ...
  ```

- Highlight the Differences:
  This is also addressed below in the Challenges section and implemented with this function:

  ```js
  function boldDifference(name: string) {
    let phrase = "(" + searchText.trim().replace(/ /g, "|") + ")";
    const __html = name.replace(
      new RegExp(phrase, "ig"),
      `<span class="matchedText">\$1</span>`
    );
    return { __html };
  }
  ```

- Support Keyboard Navigation:
  Implemented using the onKeyDown function and a switch case:

  ```js
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
  ```

- Match User’s Hover Expectations:
  Addressed using CSS with the following code:

  ```cs
  .content-item:hover,
  .content-item-selected {
    background-color: rgba(100, 100, 100, 0.5);
    }
  ```

- Show Search History:
  Further thought would need to be put in to this guideline based on how the feature will be used by the user.

- Reduce Visual Noise And Consider Including Labels & Instructions:
  The page consists only of a text area for search input and results (once the user begins typing). The search text area includes a placeholder with an example of a financial institution to search.

# Challenges

The most challenging part of the project was writing the function to emphasize the differences between the search input text and the product matches. Changing the class name multiple times within one string required some thought and data manipulation. The regular expression to allow for the searching of phrases in random order (searching for Express American will return American Express) further complicated this. In the end, I decided to use `dangerouslySetInnerHTML` to render the manipulated string with an added html class. This is done in the following function...

```js
function boldDifference(name: string) {
  let phrase = "(" + searchText.trim().replace(/ /g, "|") + ")";
  const __html = name.replace(
    new RegExp(phrase, "ig"),
    `<span class="matchedText">\$1</span>`
  );
  return { __html };
}
```

```js
dangerouslySetInnerHTML={boldDifference(product.name)}
```

In production, I've read that we should consider how this feature is being used in order to mitigate cross-site scripting attacks (for example by sanitizing content). In this case, since the text that is being set as `innerHTML` is actually always coming from a trusted source (the list of products from the server), the risk of using `dangerouslySetInnerHTML` is outweighed by the simplicity of the implementation and the benefit of the feature to the end user.

# Conclusion & Next Steps

I enjoyed working on this exercise. There were a variety of interesting algorithm and design challenges. Trying to predict user behavior and edge case scenarios could be done by understanding more about the actual intended usage of the component. In the same vein, discussing a variety of additional questions (e.g. what should the user expect to happen upon selecting/ clicking on a product?) would help ensure that it is intuitive and easy to use.

Beyond that, if I were to continue this project I would consider writing tests with either jest or cypress as those are both tools I'd like to gain more experience with.

Thanks for reading and checking out my code! Also thanks for giving me this opportunity. If anything is unclear or there are any questions/comment/concerns I'd love to hear them and get some feedback so I can continuing building my skills.
