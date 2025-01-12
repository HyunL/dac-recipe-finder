import { useEffect, useState } from "react";

import RecipeList from "../components/RecipeList";

import "./Liked.css";

const PAGE_SIZE = 28;

function Liked() {
  const [likedMeals, setLikedMeals] = useState<any[]>([]);

  useEffect(() => {
    // Get the liked meals from localStorage when the component loads
    const storedLikedMeals = JSON.parse(localStorage.getItem("liked") || "[]");
    setLikedMeals(storedLikedMeals);
  }, []);

  return (
    <div>
      <h1 className="header">Liked Recipes</h1>
      <RecipeList recipes={likedMeals} pageSize={PAGE_SIZE} />
    </div>
  );
}

export default Liked;
