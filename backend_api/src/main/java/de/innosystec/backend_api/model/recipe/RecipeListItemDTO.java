package de.innosystec.backend_api.model.recipe;

public record RecipeListItemDTO(
    Long id,
    String title,
    String imageLink
) {
}
