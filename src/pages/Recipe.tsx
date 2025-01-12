import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import { Card } from "react-bootstrap";

import "./Recipe.css";

const Recipe = () => {
  const { idMeal } = useParams(); // Get the 'i' value from the URL
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const instructionsList: string[] = meal.strInstructions
    .split("STEP")
    .slice(1);

  return meal ? (
    <div className="recipe">
      <Card className="card">
        <h1>{meal.strMeal}</h1>
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
      </Card>
      <Card className="card">
        <p>
          <strong>Instructions:</strong>
        </p>
        {instructionsList.map((instruction) => (
          <p>Step {instruction}</p>
        ))}
      </Card>
    </div>
  ) : (
    <></>
  );
};

export default Recipe;
