package de.innosystec.backend_api.model.storage;

import de.innosystec.backend_api.model.recipe.Unit;

public record UserStorageItemDTO(
        String ingredientName,
        double kcalPer100g,
        double amount,
        Unit unit
) {
}