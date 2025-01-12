import { useCallback, useEffect, useState } from "react";

import "./Home.css";
import RecipeList from "../components/RecipeList";
import { Alert, Button, Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

enum SearchMode {
  Text,
  Category,
  Area,
}

const PAGE_SIZE = 14;

function Home() {
  const [query, setQuery] = useState<string>(""); // User input
  const [results, setResults] = useState<any[] | null>(null); // API results
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [areas, setAreas] = useState<{ strArea: string }[]>([]);
  const [categories, setCategories] = useState<{ strCategory: string }[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
        );
        const data = await response.json();

        setAreas(data.meals);
      } catch (error: any) {
        setErrorMessage(error?.message || "An unexpected error occurred.");
        setAreas([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
        );
        const data = await response.json();

        setCategories(data.meals);
      } catch (error: any) {
        setErrorMessage(error?.message || "An unexpected error occurred.");
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch meals from API
  const fetchMeals = async (searchTerm: string) => {
    try {
      if (searchMode === SearchMode.Text) {
        const mealSearchResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
        );
        const data1 = await mealSearchResponse.json();

        const ingredientSearchResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`
        );
        const data2 = await ingredientSearchResponse.json();

        // Ensure that both data1.meals and data2.meals are treated as empty arrays if they are null or undefined
        const combinedResults = [
          ...(data1.meals || []), // If data1.meals is null/undefined, use an empty array
          ...(data2.meals || []), // If data2.meals is null/undefined, use an empty array
        ];

        // Remove duplicates by `idMeal`
        const uniqueResults = Array.from(
          new Map(combinedResults.map((meal) => [meal.idMeal, meal])).values()
        );

        setResults(uniqueResults);
      } else if (searchMode === SearchMode.Category) {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`
        );
        const data = await response.json();

        setResults(data.meals || []);
      } else if (searchMode === SearchMode.Area) {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`
        );
        const data = await response.json();

        setResults(data.meals || []);
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "An unexpected error occurred.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch random meal from API
  const fetchRandomMeal = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();

      if (data) {
        setResults(data.meals);
      } else {
        setResults([]);
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "An unexpected error occurred.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to limit API calls
  const debounce = (func: (searchTerm: string) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (searchTerm: string) => {
      searchTerm && setIsLoading(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => func(searchTerm), delay);
    };
  };

  const debouncedFetchMeals = useCallback(debounce(fetchMeals, 500), [
    fetchMeals,
    searchMode,
  ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");

    const value = event.target.value;
    setQuery(value);
    debouncedFetchMeals(value);
  };

  const onSurpriseMeClick = () => {
    setErrorMessage("");
    fetchRandomMeal();
  };

  const onSearchModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10); // Convert the string value to a number
    if (value in SearchMode) {
      setSearchMode(value as SearchMode); // Ensure the value is a valid SearchMode enum
    }
  };

  const onSelectFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filterValue = event.target.value;
    if (filterValue) {
      fetchMeals(filterValue); // Use the fetchMeals function directly
    }
  };

  const hasNoSearchResults = results !== null && results?.length === 0;

  return (
    <div>
      <div className="header-container ">
        <h1>Search for a recipe</h1>
        <Button onClick={onSurpriseMeClick}>Surprise Me!</Button>
      </div>
      <Form
        className="search-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <Form.Group className="mb-3">
          <Form.Select onChange={onSearchModeChange}>
            <option>Search by...</option>
            <option key="search-mode-1" value={SearchMode.Text}>
              Name or ingredient
            </option>
            <option key="search-mode-2" value={SearchMode.Category}>
              Category
            </option>
            <option key="search-mode-3" value={SearchMode.Area}>
              Cuisine
            </option>
          </Form.Select>
        </Form.Group>
        {searchMode === SearchMode.Text && (
          <Form.Group className="mb-3">
            <Form.Label>Search for a recipe:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type a recipe name or ingredient"
              onChange={handleInputChange}
              value={query}
            />
          </Form.Group>
        )}
        {searchMode === SearchMode.Category && (
          <div>
            <Form.Select onChange={onSelectFilter}>
              <option>Select a category</option>
              {categories.map((category) => (
                <option
                  key={`${category.strCategory}-category`}
                  value={category.strCategory}
                >
                  {category.strCategory}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
        {searchMode === SearchMode.Area && (
          <div>
            <Form.Select onChange={onSelectFilter}>
              <option>Select a cuisine</option>
              {areas.map((category) => (
                <option
                  key={`${category.strArea}-area`}
                  value={category.strArea}
                >
                  {category.strArea}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
      </Form>
      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          <strong>Error:</strong> {errorMessage}
        </Alert>
      )}
      <div className="search-results-container">
        {isLoading ? (
          <Spinner animation="border" variant="primary" />
        ) : hasNoSearchResults ? (
          <div>No recipe matching your search</div>
        ) : (
          <RecipeList recipes={results || []} pageSize={PAGE_SIZE} />
        )}
      </div>
    </div>
  );
}

export default Home;
