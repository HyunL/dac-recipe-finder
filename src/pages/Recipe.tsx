import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import { Button, Card } from "react-bootstrap";

import "./Recipe.css";

const Recipe = () => {
  const { idMeal } = useParams(); // Get the 'i' value from the URL
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Fetch data from the API when the component mounts or when 'i' changes
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
        );
        const data = await response.json();
        if (data.meals) {
          setMeal(data.meals[0]); // API returns an array; take the first item
        } else {
          setError("Meal not found");
        }
      } catch (err) {
        setError("Error fetching meal data");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [idMeal]);

  // Handles updating localStorage to persist list of liked recipes
  const onLikeButtonClick = (meal: any) => {
    const likedMeals = JSON.parse(localStorage.getItem("liked") || "[]");

    // Create a meal object with all necessary information
    const mealData = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    };

    // Check if the meal is already in the likedMeals array
    const mealIndex = likedMeals.findIndex(
      (likedMeal: any) => likedMeal.idMeal === meal.idMeal
    );

    if (mealIndex === -1) {
      // Add the new meal if it's not already in the liked meals array
      likedMeals.push(mealData);
      localStorage.setItem("liked", JSON.stringify(likedMeals));
      setIsLiked(true); // Update the state to "liked"
    } else {
      // Remove the meal if it's already in the liked meals array (unlike)
      likedMeals.splice(mealIndex, 1);
      localStorage.setItem("liked", JSON.stringify(likedMeals));
      setIsLiked(false); // Update the state to "unliked"
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const instructionsList: string[] = meal.strInstructions
    .split("STEP")
    .slice(1);

  return meal ? (
    <div className="recipe">
      <Card className="card">
        <div className="title-wrapper">
          <h1>{meal.strMeal}</h1>
          <Button
            variant={isLiked ? "danger" : "outline-danger"} // Change button color based on liked status
            onClick={() => onLikeButtonClick(meal)}
          >
            {isLiked ? "❤️ Liked" : "❤️ Like"}
          </Button>
        </div>
        <div className="badge-container">
          <Badge pill bg="secondary">
            {meal.strCategory}
          </Badge>
          <Badge pill bg="secondary">
            {meal.strArea}
          </Badge>
        </div>
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          rounded
          className="image"
        />
        <h3>Ingredients:</h3>
        <ul>
          {Array.from({ length: 20 }, (_, index) => {
            const ingredient = meal[`strIngredient${index + 1}`];
            const measure = meal[`strMeasure${index + 1}`];
            return (
              ingredient && (
                <li key={index}>
                  {ingredient} - {measure}
                </li>
              )
            );
          })}
        </ul>
        {meal.strYoutube && (
          <div className="youtube-player-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${meal.strYoutube.split("v=")[1]}`}
              allow="autoplay; encrypted-media; fullscreen"
              title="video"
            />
          </div>
        )}
        <p>
          <strong>Instructions:</strong>
        </p>
        {/* 
            instructions don't seem to have a standard format, if the steps aren't listed, 
            preceeded by STEP, then just print the entire string
        */}
        {instructionsList.length !== 0
          ? instructionsList.map((instruction) => <p>Step {instruction}</p>)
          : meal.strInstructions}
      </Card>
    </div>
  ) : (
    <></>
  );
};

export default Recipe;
