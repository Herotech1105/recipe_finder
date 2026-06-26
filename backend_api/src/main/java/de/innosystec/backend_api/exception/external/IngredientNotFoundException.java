package de.innosystec.backend_api.exception.external;

public class IngredientNotFoundException extends RuntimeException {
    public IngredientNotFoundException(String ingredientName) {
        super("The ingredient " + ingredientName + " does not exist in the database");
    }
}
