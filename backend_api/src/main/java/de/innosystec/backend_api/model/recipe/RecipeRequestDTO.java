package de.innosystec.backend_api.model.recipe;

import jakarta.validation.constraints.Size;

import java.util.Map;

public record RecipeRequestDTO(
        @Size(min = 6, max = 100)
        String title,

        @Size(max = 10000)
        String preparation,

        @Size(min = 3, max = 50)
        Map<Ingredient, Amount> ingredients
) {
}