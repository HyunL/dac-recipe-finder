import "./RecipeList.css";

import { useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";

const RecipeList = (props: { recipes: any[]; pageSize: number }) => {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(props.recipes.length / props.pageSize);

  // Calculate the recipes for the current page
  const startIndex = (page - 1) * props.pageSize;
  const endIndex = startIndex + props.pageSize;
  const currentRecipes = props.recipes.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  return (
    <>
      <div className="results-grid">
        {currentRecipes.map((meal) => (
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
      {pageCount > 1 && (
        <Pagination className="pagination">
          {Array.from({ length: pageCount }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === page}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default RecipeList;
