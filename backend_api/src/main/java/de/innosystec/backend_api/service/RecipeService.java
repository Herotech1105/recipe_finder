package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.authentication.UnauthorizedException;
import de.innosystec.backend_api.exception.recipe.RecipeNotFoundException;
import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.Recipe;
import de.innosystec.backend_api.model.recipe.RecipeDetailDTO;
import de.innosystec.backend_api.model.recipe.RecipeListItemDTO;
import de.innosystec.backend_api.model.recipe.RecipeRequestDTO;
import de.innosystec.backend_api.repository.AuthenticationRepository;
import de.innosystec.backend_api.repository.RecipeRepository;
import de.innosystec.backend_api.util.JWTUtil;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final AuthenticationRepository authenticationRepository;
    private final JWTUtil jwtUtil;

    public RecipeService(RecipeRepository recipeRepository,
                         AuthenticationRepository authenticationRepository,
                         JWTUtil jwtUtil) {
        this.recipeRepository = recipeRepository;
        this.authenticationRepository = authenticationRepository;
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
        recipeRepository.save(new Recipe(requestDTO, userAuthentication));
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
            recipe.setIngredients(requestDTO.ingredients());
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

}
