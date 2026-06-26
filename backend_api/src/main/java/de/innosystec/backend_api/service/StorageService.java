package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.storage.InvalidMultiplierException;
import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.Amount;
import de.innosystec.backend_api.model.recipe.Ingredient;
import de.innosystec.backend_api.model.recipe.Recipe;
import de.innosystec.backend_api.model.storage.UserStorageItem;
import de.innosystec.backend_api.model.storage.UserStorageItemDTO;
import de.innosystec.backend_api.repository.AuthenticationRepository;
import de.innosystec.backend_api.repository.IngredientRepository;
import de.innosystec.backend_api.repository.RecipeRepository;
import de.innosystec.backend_api.util.IngredientValidationUtil;
import de.innosystec.backend_api.util.JWTUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StorageService {

    private final AuthenticationRepository authenticationRepository;
    private final IngredientRepository ingredientRepository;
    private final IngredientValidationUtil ingredientValidationUtil;
    private final JWTUtil jwtUtil;
    private final RecipeRepository recipeRepository;

    public StorageService(AuthenticationRepository authenticationRepository,
                          IngredientRepository ingredientRepository,
                          IngredientValidationUtil ingredientValidationUtil,
                          JWTUtil jwtUtil,
                          RecipeRepository recipeRepository) {
        this.authenticationRepository = authenticationRepository;
        this.ingredientRepository = ingredientRepository;
        this.ingredientValidationUtil = ingredientValidationUtil;
        this.jwtUtil = jwtUtil;
        this.recipeRepository = recipeRepository;
    }

    public List<UserStorageItemDTO> getAllIngredientsInStorage(String jwtToken) {
        Authentication user = findAuthenticationByToken(jwtToken);

        return user.getStorageItems().stream()
                .map(item -> new UserStorageItemDTO(
                        item.getIngredient().getName(),
                        item.getIngredient().toIngredientResponseDTO().kcalPer100g(), // Assuming DTO or direct getter
                        item.getAmount().getAmount(),
                        item.getAmount().getUnit()
                ))
                .collect(java.util.stream.Collectors.toList());
    }

    public void addOrUpdateIngredientInStorage(String jwtToken, String ingredientName, Amount amount) {
        Authentication user = findAuthenticationByToken(jwtToken);
        Ingredient ingredient = getOrCreateIngredient(ingredientName);

        Optional<UserStorageItem> existingItem = user.getStorageItems().stream()
                .filter(item -> item.getIngredient().equals(ingredient))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setAmount(amount);
        } else {
            user.addIngredientToStorage(ingredient, amount);
        }

        authenticationRepository.save(user);
    }

    public void removeIngredientFromStorage(String jwtToken, String ingredientName) {
        Authentication user = findAuthenticationByToken(jwtToken);

        ingredientRepository.findByName(ingredientName).ifPresent(ingredient -> {
            user.removeIngredientFromStorage(ingredient);
            authenticationRepository.save(user);
        });
    }

    public void consumeRecipeIngredients(String jwtToken, Long recipeId, double multiplier) {
        if (multiplier < 0.1 || multiplier > 20.0) {
            throw new InvalidMultiplierException();
        }

        Authentication user = findAuthenticationByToken(jwtToken);
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new de.innosystec.backend_api.exception.recipe.RecipeNotFoundException(recipeId));

        recipe.getIngredients().forEach((ingredient, recipeAmount) -> user.getStorageItems()
                .stream()
                .filter(item -> item.getIngredient().equals(ingredient))
                .findFirst()
                .ifPresent(storageItem -> {
                    Amount currentAmount = storageItem.getAmount();

                    double amountToDeduct = recipeAmount.getAmount() * multiplier;
                    double newAmountValue = currentAmount.getAmount() - amountToDeduct;

                    if (newAmountValue <= 0) {
                        user.removeIngredientFromStorage(ingredient);
                    } else {
                        storageItem.setAmount(new Amount(currentAmount.getUnit(), newAmountValue));
                    }
                }));

        authenticationRepository.save(user);
    }


    private Authentication findAuthenticationByToken(String jwtToken) {
        String username = jwtUtil.getUsernameFromToken(jwtToken);
        return authenticationRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationNotFoundException(username));
    }

    private Ingredient getOrCreateIngredient(String ingredientName) {
        return ingredientRepository.findByName(ingredientName)
                .orElseGet(() -> {
                    double kcalPer100g = ingredientValidationUtil
                            .getKcalByIngredientName(ingredientName)
                            .orElse(0.0);

                    Ingredient newIngredient = new Ingredient(ingredientName, kcalPer100g);
                    return ingredientRepository.save(newIngredient);
                });
    }
}