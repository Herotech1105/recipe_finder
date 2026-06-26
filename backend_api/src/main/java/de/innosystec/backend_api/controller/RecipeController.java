package de.innosystec.backend_api.controller;

import de.innosystec.backend_api.model.recipe.*;
import de.innosystec.backend_api.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
    private final RecipeService service;

    public RecipeController(RecipeService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public RecipeDetailDTO getRecipeById(@PathVariable Long id) {
        return service.getRecipeById(id);
    }

    @GetMapping
    public List<RecipeListItemDTO> getRecipeOverviewList() {
        return service.getALlRecipes();
    }

    @GetMapping("/{id}/nutrition")
    public List<IngredientResponseDTO> getRecipeIngredientNutritionById(@PathVariable Long id) {
        return service.getIngredientNutritionByRecipeId(id);
    }

    @GetMapping
    public List<RecipeListItemDTO> getRecipesWithAtMostTwoMissingIngredients(@RequestHeader("Authorization") String jwtToken) {
        return service.getRecipesWithAtMostTwoMissingIngredients(jwtToken.substring(7));
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public void createRecipe(@RequestBody @Valid RecipeRequestDTO recipeRequest,
                             @RequestHeader("Authorization") String jwtToken) {
        service.createRecipe(recipeRequest, jwtToken.substring(7));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteRecipe(@PathVariable Long id,
                             @RequestHeader("Authorization") String jwtToken) {
        service.deleteRecipe(id, jwtToken.substring(7));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    public void updateRecipe(@PathVariable Long id,
                             @RequestBody @Valid RecipeRequestDTO recipeRequest,
                             @RequestHeader("Authorization") String jwtToken
    ) {
        service.updateRecipe(id, recipeRequest, jwtToken.substring(7));
    }

}
