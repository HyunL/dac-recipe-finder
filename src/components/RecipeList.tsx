import "./RecipeList.css";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const RecipeList = (props: { recipes: any[] }) => {
  return (
    <>
      <div className="results-grid">
        {props.recipes.map((meal) => (
          <Card key={meal.idMeal} className="meal-card">
            <Card.Img variant="top" src={meal.strMealThumb} />
            <Card.Body>
              <Card.Title>{meal.strMeal}</Card.Title>
              <Link to={`/recipe/${meal.idMeal}`}>
                <Button variant="primary">Recipe</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default RecipeList;
