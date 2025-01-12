import { useCallback, useState } from "react";

import "./Home.css";
import RecipeList from "../components/RecipeList";
import { Alert } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function Home() {
  const [query, setQuery] = useState<string>(""); // User input
  const [results, setResults] = useState<any[] | null>(null); // API results
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch meals from API
  const fetchMeals = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      const data = await response.json();

      if (data.meals) {
        setResults(data.meals);
      } else {
        setResults([]); // No results
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

  const hasNoSearchResults = results !== null && results?.length === 0;

  return (
    <div>
      <form className="search-bar-container" onSubmit={handleSubmit}>
        <label htmlFor="search-bar" className="search-bar-label">
          Search for a recipe:
        </label>
        <input
          type="text"
          id="search-bar"
          className="search-bar"
          placeholder="Type a recipe"
          value={query}
          onChange={handleInputChange}
          required
        />
        {errorMessage && (
          <Alert variant="danger" className="mt-3">
            <strong>Error:</strong> {errorMessage}
          </Alert>
        )}
      </form>
      {isLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : hasNoSearchResults ? (
        <div>No recipe matching your search</div>
      ) : (
        <RecipeList recipes={results || []} />
      )}
      {/* {hasNoSearchResults && <div>No recipe matching your search</div>} */}
    </div>
  );
}

export default Home;
