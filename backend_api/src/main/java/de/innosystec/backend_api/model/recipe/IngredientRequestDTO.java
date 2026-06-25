package de.innosystec.backend_api.model.recipe;

import jakarta.validation.constraints.Size;

public record IngredientRequestDTO(
        @Size(min = 1, max = 30)
        String name
) {
}
