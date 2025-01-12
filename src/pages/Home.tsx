import { useCallback, useState } from "react";

import "./Home.css";
import RecipeList from "../components/RecipeList";
import { Alert, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const PAGE_SIZE = 14;

function Home() {
  const [query, setQuery] = useState<string>(""); // User input
  const [results, setResults] = useState<any[] | null>(null); // API results
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch meals from API
  const fetchMeals = async (searchTerm: string) => {
    try {
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

  const debouncedFetchMeals = useCallback(debounce(fetchMeals, 500), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    debouncedFetchMeals(query);
  };

  const onSurpriseMeClick = () => {
    setErrorMessage("");
    fetchRandomMeal();
  };

  const hasNoSearchResults = results !== null && results?.length === 0;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search-bar" className="search-bar-label">
          Search for a recipe:
        </label>
        <input
          type="text"
          id="search-bar"
          className="search-bar"
          placeholder="Type a recipe name or ingredient"
          value={query}
          onChange={handleInputChange}
          required
        />
      </form>
      <Button className="surprise-me-btn" onClick={onSurpriseMeClick}>
        Surprise Me!
      </Button>
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
