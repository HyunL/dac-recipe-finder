import { useCallback, useState } from "react";

import "./Home.css";
import RecipeList from "../components/RecipeList";

function Home() {
  const [query, setQuery] = useState<string>(""); // User input
  const [results, setResults] = useState<any[]>([]); // API results
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Fetch meals from API
  const fetchMeals = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      setIsLoading(false);
      return;
    }

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
    } catch (error) {
      console.error("Error fetching meals:", error);
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
    debouncedFetchMeals(value);
    console.log(results);
  };

  return (
    <div>
      <div className="search-bar-container">
        <label htmlFor="search-bar" className="search-bar-label">
          Search for a meal:
        </label>
        <input
          type="text"
          id="search-bar"
          className="search-bar"
          placeholder="Type a meal"
          value={query}
          onChange={handleInputChange}
        />
      </div>
      {isLoading ? <div>LOADING</div> : <RecipeList recipes={results} />}
    </div>
  );
}

export default Home;
