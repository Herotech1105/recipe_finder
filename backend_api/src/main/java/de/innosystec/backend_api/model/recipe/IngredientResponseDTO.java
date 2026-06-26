package de.innosystec.backend_api.model.recipe;

public record IngredientResponseDTO(
        String name,
        double kcalPer100g
) {
}
