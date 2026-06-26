package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.recipe.RecipeNotFoundException;
import de.innosystec.backend_api.exception.storage.InvalidMultiplierException;
import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.Amount;
import de.innosystec.backend_api.model.recipe.Ingredient;
import de.innosystec.backend_api.model.recipe.Recipe;
import de.innosystec.backend_api.model.recipe.Unit;
import de.innosystec.backend_api.model.storage.UserStorageItem;
import de.innosystec.backend_api.model.storage.UserStorageItemDTO;
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
class StorageServiceTest {

    @Mock
    private AuthenticationRepository authenticationRepository;

    @Mock
    private IngredientRepository ingredientRepository;

    @Mock
    private IngredientValidationUtil ingredientValidationUtil;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private RecipeRepository recipeRepository;

    @InjectMocks
    private StorageService storageService;

    private Authentication mockUser;
    private final String testJwt = "mocked-jwt-token";
    private final String username = "user";

    @BeforeEach
    void setUp() {
        mockUser = mock(Authentication.class);
    }

    private void mockTokenValidation() {
        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
    }

    // --- SHARED TOKEN AUTHENTICATION TESTS ---

    @Test
    void findAuthenticationByToken_ThrowsAuthenticationNotFoundException() {
        when(jwtUtil.getUsernameFromToken(testJwt)).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(AuthenticationNotFoundException.class, () -> storageService.getAllIngredientsInStorage(testJwt));
    }

    // --- GET ALL INGREDIENTS IN STORAGE TESTS ---

    @Test
    void getAllIngredientsInStorage_Success() {
        mockTokenValidation();

        UserStorageItem item = mock(UserStorageItem.class);
        Ingredient ingredient = mock(Ingredient.class);
        Amount amount = mock(Amount.class);
        var responseDTO = mock(de.innosystec.backend_api.model.recipe.IngredientResponseDTO.class);

        when(mockUser.getStorageItems()).thenReturn(List.of(item));
        when(item.getIngredient()).thenReturn(ingredient);
        when(ingredient.getName()).thenReturn("Salt");
        when(ingredient.toIngredientResponseDTO()).thenReturn(responseDTO);
        when(responseDTO.kcalPer100g()).thenReturn(0.0);
        when(item.getAmount()).thenReturn(amount);
        when(amount.getAmount()).thenReturn(50.0);
        when(amount.getUnit()).thenReturn(Unit.g);

        List<UserStorageItemDTO> result = storageService.getAllIngredientsInStorage(testJwt);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Salt", result.getFirst().ingredientName());
        assertEquals(50.0, result.getFirst().amount());
    }

    // --- ADD OR UPDATE INGREDIENT IN STORAGE TESTS ---

    @Test
    void addOrUpdateIngredient_UpdatesExistingItem() {
        mockTokenValidation();
        String ingredientName = "Tomato";
        Amount newAmount = new Amount(Unit.g, 200.0);

        Ingredient ingredient = mock(Ingredient.class);
        UserStorageItem existingItem = mock(UserStorageItem.class);

        when(ingredientRepository.findByName(ingredientName)).thenReturn(Optional.of(ingredient));
        when(mockUser.getStorageItems()).thenReturn(List.of(existingItem));
        when(existingItem.getIngredient()).thenReturn(ingredient);

        storageService.addOrUpdateIngredientInStorage(testJwt, ingredientName, newAmount);

        verify(existingItem).setAmount(newAmount);
        verify(authenticationRepository).save(mockUser);
    }

    @Test
    void addOrUpdateIngredient_AddsNewExistingIngredientToStorage() {
        mockTokenValidation();
        String ingredientName = "Tomato";
        Amount amount = new Amount(Unit.g, 100.0);

        Ingredient ingredient = mock(Ingredient.class);
        when(ingredientRepository.findByName(ingredientName)).thenReturn(Optional.of(ingredient));
        when(mockUser.getStorageItems()).thenReturn(Collections.emptyList());

        storageService.addOrUpdateIngredientInStorage(testJwt, ingredientName, amount);

        verify(mockUser).addIngredientToStorage(ingredient, amount);
        verify(authenticationRepository).save(mockUser);
    }

    @Test
    void addOrUpdateIngredient_CreatesAndAddsBrandNewIngredient() {
        mockTokenValidation();
        String ingredientName = "UniqueBerry";
        Amount amount = new Amount(Unit.g, 100.0);

        when(ingredientRepository.findByName(ingredientName)).thenReturn(Optional.empty());
        when(ingredientValidationUtil.getKcalByIngredientName(ingredientName)).thenReturn(Optional.of(45.0));
        when(mockUser.getStorageItems()).thenReturn(Collections.emptyList());

        when(ingredientRepository.save(any(Ingredient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        storageService.addOrUpdateIngredientInStorage(testJwt, ingredientName, amount);

        verify(ingredientRepository).save(any(Ingredient.class));
        verify(mockUser).addIngredientToStorage(any(Ingredient.class), eq(amount));
        verify(authenticationRepository).save(mockUser);
    }

    // --- REMOVE INGREDIENT FROM STORAGE TESTS ---

    @Test
    void removeIngredientFromStorage_Success() {
        mockTokenValidation();
        String ingredientName = "Garlic";
        Ingredient ingredient = mock(Ingredient.class);

        when(ingredientRepository.findByName(ingredientName)).thenReturn(Optional.of(ingredient));

        storageService.removeIngredientFromStorage(testJwt, ingredientName);

        verify(mockUser).removeIngredientFromStorage(ingredient);
        verify(authenticationRepository).save(mockUser);
    }

    @Test
    void removeIngredientFromStorage_IngredientNotFound_DoesNothing() {
        mockTokenValidation();
        String ingredientName = "GhostIngredient";

        when(ingredientRepository.findByName(ingredientName)).thenReturn(Optional.empty());

        storageService.removeIngredientFromStorage(testJwt, ingredientName);

        verify(mockUser, never()).removeIngredientFromStorage(any());
        verify(authenticationRepository, never()).save(any());
    }

    // --- CONSUME RECIPE INGREDIENTS TESTS ---

    @Test
    void consumeRecipeIngredients_ThrowsInvalidMultiplierException_TooLow() {
        assertThrows(InvalidMultiplierException.class, () ->
                storageService.consumeRecipeIngredients(testJwt, 1L, 0.05));
    }

    @Test
    void consumeRecipeIngredients_ThrowsInvalidMultiplierException_TooHigh() {
        assertThrows(InvalidMultiplierException.class, () ->
                storageService.consumeRecipeIngredients(testJwt, 1L, 25.0));
    }

    @Test
    void consumeRecipeIngredients_ThrowsRecipeNotFoundException() {
        mockTokenValidation();
        Long recipeId = 100L;
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.empty());

        assertThrows(RecipeNotFoundException.class, () ->
                storageService.consumeRecipeIngredients(testJwt, recipeId, 1.0));
    }

    @Test
    void consumeRecipeIngredients_DeductsPartialAmount() {
        mockTokenValidation();
        Long recipeId = 1L;
        Recipe recipe = mock(Recipe.class);
        Ingredient ingredient = mock(Ingredient.class);
        Amount recipeAmount = new Amount(Unit.g, 50.0);
        UserStorageItem storageItem = mock(UserStorageItem.class);
        Amount currentStorageAmount = new Amount(Unit.g, 150.0);

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(recipe));

        Map<Ingredient, Amount> recipeIngredients = Map.of(ingredient, recipeAmount);
        when(recipe.getIngredients()).thenReturn(recipeIngredients);

        when(mockUser.getStorageItems()).thenReturn(List.of(storageItem));
        when(storageItem.getIngredient()).thenReturn(ingredient);
        when(storageItem.getAmount()).thenReturn(currentStorageAmount);

        storageService.consumeRecipeIngredients(testJwt, recipeId, 2.0);

        verify(storageItem).setAmount(any());
        verify(mockUser, never()).removeIngredientFromStorage(any());
        verify(authenticationRepository).save(mockUser);
    }

    @Test
    void consumeRecipeIngredients_RemovesIngredientWhenAmountDropsToZeroOrLess() {
        mockTokenValidation();
        Long recipeId = 1L;
        Recipe recipe = mock(Recipe.class);
        Ingredient ingredient = mock(Ingredient.class);
        Amount recipeAmount = new Amount(Unit.g, 100.0);
        UserStorageItem storageItem = mock(UserStorageItem.class);
        Amount currentStorageAmount = new Amount(Unit.g, 100.0);

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(recipe));

        Map<Ingredient, Amount> recipeIngredients = Map.of(ingredient, recipeAmount);
        when(recipe.getIngredients()).thenReturn(recipeIngredients);

        when(mockUser.getStorageItems()).thenReturn(List.of(storageItem));
        when(storageItem.getIngredient()).thenReturn(ingredient);
        when(storageItem.getAmount()).thenReturn(currentStorageAmount);

        storageService.consumeRecipeIngredients(testJwt, recipeId, 1.0);

        verify(mockUser).removeIngredientFromStorage(ingredient);
        verify(storageItem, never()).setAmount(any());
        verify(authenticationRepository).save(mockUser);
    }
}