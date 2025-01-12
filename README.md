# Hyunjin Lee: DAC Frontend Developer Assignment

## Setup and Usage

1. Clone the repo ([read this](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) if you need help)
2. run `npm install` to install dependancies,
3. run `npm run dev` to start the development server. You'll be able to access the React app at the address labeled `local:`. `http://localhost:5173/` in the example below.

```

  VITE v6.0.7  ready in 117 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Core Requirements

**The user should be able to use this React app to:**

- Search for recipes by meal or ingredient name
- See meal thumbnails and names in the search results
- Clicking on a search result to navigate to a page with more details such as:
  - Meal name
  - Category and cuisine
  - Instructions
  - Ingredients and measures
  - Meal thumbnail image
  - YouTube video (if available)
- See appropriate error messages if:
  - The API call fails.
  - No meals are found for the search term.
- Use this web app on mobile and desktop

**Additional Requirements:**

- All of the components are functional requirements, so there should adequate examples of hooks being used.
- For styling, a combination of custom styling and Bootstrap

## All 5 Bonus Features Completed! 🎉:

- Favorites List:

  - Users are able to save their favourite recipes by clicking the like button on the recipe page
  - Users can view their liked recipes navigating to the `/liked` page. Accessible via the nav bar.

- Random Meal Feature:

  - Users can view a random recipe by clicking the "Surprise Me!" button, found on the homepage

    ![alt text](image.png)

- Filter by Category or Area:

  - Users can view all foods by `categories` and `areas`

- Debounced Search:

  - allows for search results that update as the user types, while limiting number of API calls

- Pagination:
  - Page sizes of 14 for the search results (try searching by category -> "Beef" to test pagination)
  - Page sizes of 21 for the liked recipes page
