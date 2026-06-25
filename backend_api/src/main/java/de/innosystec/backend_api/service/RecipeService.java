package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.authentication.UnauthorizedException;
import de.innosystec.backend_api.exception.recipe.RecipeNotFoundException;
import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.*;
import de.innosystec.backend_api.repository.AuthenticationRepository;
import de.innosystec.backend_api.repository.IngredientRepository;
import de.innosystec.backend_api.repository.RecipeRepository;
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

    public RecipeService(RecipeRepository recipeRepository,
                         AuthenticationRepository authenticationRepository,
                         IngredientRepository ingredientRepository,
                         JWTUtil jwtUtil) {
        this.recipeRepository = recipeRepository;
        this.authenticationRepository = authenticationRepository;
        this.ingredientRepository = ingredientRepository;
        this.jwtUtil = jwtUtil;
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
                (ingredientRequestDTO, amount) -> {
                    String ingredientName = ingredientRequestDTO.name();
                    Ingredient ingredient = ingredientRepository.findByName(ingredientName).
                            orElseGet(() -> {
                                Ingredient newIngredient = new Ingredient(ingredientName);
                                ingredientRepository.save(newIngredient);
                                return newIngredient;
                            });
                    ingredients.put(ingredient, amount);
                });
        return ingredients;
    }

}
