package de.innosystec.backend_api.model.recipe;

import java.util.Map;

public record RecipeDetailDTO(
        Long id,
        String title,
        String preparation,
        Map<String, Amount> ingredients,
        Long authorId,
        String authorName,
        String imageLink
) {
}
