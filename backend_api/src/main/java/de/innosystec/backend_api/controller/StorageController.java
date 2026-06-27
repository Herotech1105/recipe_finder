package de.innosystec.backend_api.controller;

import de.innosystec.backend_api.model.recipe.Amount;
import de.innosystec.backend_api.model.storage.UserStorageItemDTO;
import de.innosystec.backend_api.service.StorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/storage")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/ingredients")
    public List<UserStorageItemDTO> getIngredients(@RequestHeader("Authorization") String jwtToken) {
        return storageService.getAllIngredientsInStorage(jwtToken.substring(7));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/ingredients/{ingredientName}")
    public void addOrUpdateIngredient(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable String ingredientName,
            @RequestBody @Valid Amount amount) {
        storageService.addOrUpdateIngredientInStorage(jwtToken.substring(7), ingredientName, amount);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/ingredients/{ingredientName}")
    public void removeIngredient(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable String ingredientName) {
        storageService.removeIngredientFromStorage(jwtToken.substring(7), ingredientName);
    }

    @PostMapping("/consume-recipe/{recipeId}")
    public void consumeRecipeIngredients(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long recipeId,
            @RequestParam(defaultValue = "1.0") double multiplier) {
        storageService.consumeRecipeIngredients(jwtToken.substring(7), recipeId, multiplier);
    }
}