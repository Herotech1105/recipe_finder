package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.authentication.UnauthorizedException;
import de.innosystec.backend_api.exception.recipe.RecipeNotFoundException;
import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.*;
import de.innosystec.backend_api.model.storage.UserStorageItem;
import de.innosystec.backend_api.repository.AuthenticationRepository;
import de.innosystec.backend_api.repository.IngredientRepository;
import de.innosystec.backend_api.repository.RecipeRepository;
import de.innosystec.backend_api.util.IngredientValidationUtil;
import de.innosystec.backend_api.util.JWTUtil;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final AuthenticationRepository authenticationRepository;
    private final IngredientRepository ingredientRepository;
    private final JWTUtil jwtUtil;
    private final IngredientValidationUtil ingredientValidationUtil;

    public RecipeService(RecipeRepository recipeRepository,
                         AuthenticationRepository authenticationRepository,
                         IngredientRepository ingredientRepository,
                         JWTUtil jwtUtil,
                         IngredientValidationUtil ingredientValidationUtil) {
        this.recipeRepository = recipeRepository;
        this.authenticationRepository = authenticationRepository;
        this.ingredientRepository = ingredientRepository;
        this.jwtUtil = jwtUtil;
        this.ingredientValidationUtil = ingredientValidationUtil;
    }

    public RecipeDetailDTO getRecipeById(Long id) {
        return findRecipeById(id).toRecipeDetailDTO();
    }

    public List<RecipeListItemDTO> getALlRecipes() {
        List<RecipeListItemDTO> dtoList = new LinkedList<>();
        recipeRepository.findAll().forEach(
                recipe -> dtoList.add(recipe.toRecipeListItemDTO())
        );
        return dtoList;
    }

    public List<IngredientResponseDTO> getIngredientNutritionByRecipeId(Long id) {
        return findRecipeById(id).getIngredientNutrition();
    }

    public List<RecipeListItemDTO> getRecipesWithAtMostTwoMissingIngredients(String jwtToken) {
        String username = jwtUtil.getUsernameFromToken(jwtToken);
        Authentication userAuthentication = findAuthenticationByUsername(username);

        java.util.Set<Ingredient> ownedIngredients = userAuthentication.getStorageItems().stream()
                .map(UserStorageItem::getIngredient)
                .collect(java.util.stream.Collectors.toSet());

        List<RecipeListItemDTO> manageableRecipes = new LinkedList<>();

        recipeRepository.findAll().forEach(recipe -> {
            java.util.Set<Ingredient> recipeIngredients = recipe.getIngredients().keySet();


            long missingCount = recipeIngredients.stream()
                    .filter(ingredient -> !ownedIngredients.contains(ingredient))
                    .count();

            if (missingCount <= 2) {
                manageableRecipes.add(recipe.toRecipeListItemDTO());
            }
        });

        return manageableRecipes;
    }

    public void createRecipe(@Valid RecipeRequestDTO requestDTO,
                             String jwtToken) {
        String username = jwtUtil.getUsernameFromToken(jwtToken);
        Authentication userAuthentication = findAuthenticationByUsername(username);
        recipeRepository.save(new Recipe(requestDTO, userAuthentication, mapIngredientsFromDTO(requestDTO)));
    }

    public void deleteRecipe(Long id, String jwtToken) {
        String username = jwtUtil.getUsernameFromToken(jwtToken);
        Authentication userAuthentication = findAuthenticationByUsername(username);
        Recipe recipe = findRecipeById(id);
        if (!recipe.getAuthentication().equals(userAuthentication)) {
            throw new UnauthorizedException();
        }
        else {
            recipeRepository.delete(recipe);
        }
    }

    public void updateRecipe(Long id,
                             @Valid RecipeRequestDTO requestDTO,
                             String jwtToken) {
        String username = jwtUtil.getUsernameFromToken(jwtToken);
        Authentication userAuthentication = findAuthenticationByUsername(username);
        Recipe recipe = findRecipeById(id);
        if (!recipe.getAuthentication().equals(userAuthentication)) {
            throw new UnauthorizedException();
        }
        else {
            recipe.setTitle(requestDTO.title());
            recipe.setPreparation(requestDTO.preparation());
            recipe.setIngredients(mapIngredientsFromDTO(requestDTO));
            recipeRepository.save(recipe);
        }
    }

    private Authentication findAuthenticationByUsername(String username) {
        return authenticationRepository.findByUsername(username).
                orElseThrow(() -> new AuthenticationNotFoundException(username));
    }

    private Recipe findRecipeById(Long id) {
        return recipeRepository.findById(id).
                orElseThrow(() -> new RecipeNotFoundException(id));
    }

    private Map<Ingredient, Amount> mapIngredientsFromDTO(RecipeRequestDTO requestDTO) {
        Map<Ingredient, Amount> ingredients = new HashMap<>();
        requestDTO.ingredients().forEach(
                (ingredientName, amount) -> {
                    Ingredient ingredient = ingredientRepository.findByName(ingredientName.toLowerCase())
                            .orElseGet(() -> {
                                double kcalPer100g = ingredientValidationUtil
                                        .getKcalByIngredientName(ingredientName.toLowerCase())
                                        .orElse(0.0);

                                Ingredient newIngredient = new Ingredient(ingredientName.toLowerCase(), kcalPer100g);
                                return ingredientRepository.save(newIngredient);
                            });
                    ingredients.put(ingredient, amount);
                });
        return ingredients;
    }

}
