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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private AuthenticationRepository authenticationRepository;

    @Mock
    private IngredientRepository ingredientRepository;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private IngredientValidationUtil ingredientValidationUtil;

    @InjectMocks
    private RecipeService recipeService;

    private Authentication mockUser;
    private Recipe mockRecipe;
    private final String testJwt = "mocked-jwt-token";
    private final String username = "user";

    @BeforeEach
    void setUp() {
        mockUser = mock(Authentication.class);
        mockRecipe = mock(Recipe.class);
    }

    // --- GET RECIPE BY ID TESTS ---

    @Test
    void getRecipeById_Success() {
        Long recipeId = 1L;
        RecipeDetailDTO expectedDTO = mock(RecipeDetailDTO.class);

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(mockRecipe));
        when(mockRecipe.toRecipeDetailDTO()).thenReturn(expectedDTO);

        RecipeDetailDTO result = recipeService.getRecipeById(recipeId);

        assertNotNull(result);
        assertEquals(expectedDTO, result);
        verify(recipeRepository).findById(recipeId);
    }

    @Test
    void getRecipeById_ThrowsRecipeNotFoundException() {
        Long recipeId = 1L;
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.empty());

        assertThrows(RecipeNotFoundException.class, () -> recipeService.getRecipeById(recipeId));
    }

    // --- GET ALL RECIPES TESTS ---

    @Test
    void getAllRecipes_ReturnsList() {
        RecipeListItemDTO listItemDTO = mock(RecipeListItemDTO.class);
        when(mockRecipe.toRecipeListItemDTO()).thenReturn(listItemDTO);
        when(recipeRepository.findAll()).thenReturn(List.of(mockRecipe));

        List<RecipeListItemDTO> result = recipeService.getALlRecipes();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(listItemDTO, result.getFirst());
    }

    // --- GET INGREDIENT NUTRITION BY RECIPE ID TESTS ---

    @Test
    void getIngredientNutritionByRecipeId_Success() {
        Long recipeId = 1L;
        List<IngredientResponseDTO> expectedNutrition = List.of(mock(IngredientResponseDTO.class));

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(mockRecipe));
        when(mockRecipe.getIngredientNutrition()).thenReturn(expectedNutrition);

        List<IngredientResponseDTO> result = recipeService.getIngredientNutritionByRecipeId(recipeId);

        assertEquals(expectedNutrition, result);
    }

    // --- GET RECIPES WITH AT MOST TWO MISSING INGREDIENTS TESTS ---

    @Test
    void getRecipesWithAtMostTwoMissingIngredients_Success() {
        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));

        Ingredient ingredient1 = mock(Ingredient.class);
        Ingredient ingredient2 = mock(Ingredient.class);
        Ingredient ingredient3 = mock(Ingredient.class);

        UserStorageItem storageItem = mock(UserStorageItem.class);
        when(storageItem.getIngredient()).thenReturn(ingredient1);
        when(mockUser.getStorageItems()).thenReturn(List.of(storageItem));

        Map<Ingredient, Amount> recipeIngredients = new LinkedHashMap<>();
        recipeIngredients.put(ingredient1, mock(Amount.class));
        recipeIngredients.put(ingredient2, mock(Amount.class));
        recipeIngredients.put(ingredient3, mock(Amount.class));

        when(mockRecipe.getIngredients()).thenReturn(recipeIngredients);
        RecipeListItemDTO listItemDTO = mock(RecipeListItemDTO.class);
        when(mockRecipe.toRecipeListItemDTO()).thenReturn(listItemDTO);
        when(recipeRepository.findAll()).thenReturn(List.of(mockRecipe));

        List<RecipeListItemDTO> result = recipeService.getRecipesWithAtMostTwoMissingIngredients(testJwt);

        assertEquals(1, result.size());
        assertEquals(listItemDTO, result.getFirst());
    }

    // --- CREATE RECIPE TESTS ---

    @Test
    void createRecipe_Success() {
        RecipeRequestDTO requestDTO = new RecipeRequestDTO("Title", "Steps", Collections.emptyMap());

        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));

        recipeService.createRecipe(requestDTO, testJwt);

        verify(recipeRepository).save(any(Recipe.class));
    }

    @Test
    void createRecipe_ThrowsAuthenticationNotFoundException() {
        RecipeRequestDTO requestDTO = new RecipeRequestDTO("Title", "Steps", Collections.emptyMap());

        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(AuthenticationNotFoundException.class, () -> recipeService.createRecipe(requestDTO, testJwt));
    }

    // --- UPDATE RECIPE TESTS ---

    @Test
    void updateRecipe_Success() {
        Long recipeId = 1L;
        RecipeRequestDTO requestDTO = new RecipeRequestDTO("Updated Title", "Updated Steps", Collections.emptyMap());

        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(mockRecipe));
        when(mockRecipe.getAuthentication()).thenReturn(mockUser);

        recipeService.updateRecipe(recipeId, requestDTO, testJwt);

        verify(mockRecipe).setTitle("Updated Title");
        verify(mockRecipe).setPreparation("Updated Steps");
        verify(recipeRepository).save(mockRecipe);
    }

    @Test
    void updateRecipe_ThrowsUnauthorizedException() {
        Long recipeId = 1L;
        RecipeRequestDTO requestDTO = new RecipeRequestDTO("Updated Title", "Updated Steps", Collections.emptyMap());
        Authentication differentUser = mock(Authentication.class);

        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(mockRecipe));
        when(mockRecipe.getAuthentication()).thenReturn(differentUser);

        assertThrows(UnauthorizedException.class, () -> recipeService.updateRecipe(recipeId, requestDTO, testJwt));
        verify(recipeRepository, never()).save(any());
    }

    // --- DELETE RECIPE TESTS ---

    @Test
    void deleteRecipe_Success() {
        Long recipeId = 1L;
        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(mockRecipe));
        when(mockRecipe.getAuthentication()).thenReturn(mockUser);

        recipeService.deleteRecipe(recipeId, testJwt);

        verify(recipeRepository).delete(mockRecipe);
    }

    @Test
    void deleteRecipe_ThrowsUnauthorizedException() {
        Long recipeId = 1L;
        Authentication differentUser = mock(Authentication.class);

        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(mockRecipe));
        when(mockRecipe.getAuthentication()).thenReturn(differentUser);

        assertThrows(UnauthorizedException.class, () -> recipeService.deleteRecipe(recipeId, testJwt));
        verify(recipeRepository, never()).delete(any());
    }
}