import "./RecipeList.css";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const RecipeList = (props: { recipes: any[] }) => {
  return (
    <>
      <div className="results-grid">
        {props.recipes.map((meal) => (
          <Card key={meal.idMeal} className="meal-card">
            <Card.Img variant="top" src={meal.strMealThumb} />
            <Card.Body>
              <Card.Title>{meal.strMeal}</Card.Title>
              <Button variant="primary">Recipe</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default RecipeList;
