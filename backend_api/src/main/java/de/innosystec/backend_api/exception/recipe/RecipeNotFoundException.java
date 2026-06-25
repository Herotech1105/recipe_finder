package de.innosystec.backend_api.exception.recipe;

public class RecipeNotFoundException extends RuntimeException {
    public RecipeNotFoundException(Long id) {
        super("No recipe with id " + id.toString() + " found");
    }
}
