package de.innosystec.backend_api.model.recipe;

import de.innosystec.backend_api.model.authentication.Authentication;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Entity
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 6, max = 100)
    private String title;

    @Size(min = 20, max = 10000)
    private String preparation;

    @ElementCollection
    @CollectionTable(
            name = "recipe_ingredients",
            joinColumns = @JoinColumn(name = "recipe_id")
    )
    @MapKeyJoinColumn(name = "ingredient_id")
    @Size(min = 3, max = 50)
    private Map<Ingredient, Amount> ingredients;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    private Authentication authentication;

    public Recipe(@Valid RecipeRequestDTO requestDTO,
                  @Valid Authentication authentication,
                  @Valid Map<Ingredient, Amount> ingredients) {
        this.title = requestDTO.title();
        this.preparation = requestDTO.preparation();
        this.ingredients = ingredients;
        this.authentication = authentication;
    }

    protected Recipe() {

    }

    public String getTitle() {
        return title;
    }

    public String getPreparation() {
        return preparation;
    }

    public Authentication getAuthentication() {
        return authentication;
    }

    public Map<Ingredient, Amount> getIngredients() {
        return ingredients;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPreparation(String preparation) {
        this.preparation = preparation;
    }

    public void setIngredients(Map<Ingredient, Amount> ingredients) {
        this.ingredients = ingredients;
    }

    public RecipeListItemDTO toRecipeListItemDTO() {
        return new RecipeListItemDTO(
                id,
                title,
                "image" + id.toString() + ".recipe.jpeg"
        );
    }

    public RecipeDetailDTO toRecipeDetailDTO() {
        Map<String, Amount> ingredientStringMap = new HashMap<>();
        ingredients.forEach(
                (ingredient, amount) -> ingredientStringMap.put(ingredient.getName(), amount));
        return new RecipeDetailDTO(
                id,
                title,
                preparation,
                ingredientStringMap,
                authentication.getId(),
                authentication.getUsername(),
                "image" + id.toString() + ".recipe.jpeg"
        );
    }

    public List<IngredientResponseDTO> getIngredientNutrition() {
        List<IngredientResponseDTO> list = new LinkedList<>();
        ingredients.forEach((ingredient, amount) -> list.add(ingredient.toIngredientResponseDTO()));
        return list;
    }


}
