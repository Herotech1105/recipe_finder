package de.innosystec.backend_api.model.recipe;

import de.innosystec.backend_api.model.authentication.Authentication;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.Map;

@Entity
public class Recipe {
    @Id
    @GeneratedValue
    private Long id;

    @Size(min = 6, max = 100)
    private String title;

    @Size(max = 10000)
    private String preparation;

    @ElementCollection
    @CollectionTable(
            name = "recipe_ingredients",
            joinColumns = @JoinColumn(name = "recipe_id")
    )
    @MapKeyJoinColumn(name = "ingredient_id")
    private Map<Ingredient, Amount> ingredients;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    private Authentication authentication;

    private String imageLink;

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

    public String getImageLink() {
        return imageLink;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPreparation(String preparation) {
        this.preparation = preparation;
    }

    public RecipeListItemDTO toRecipeListItemDTO() {
        return new RecipeListItemDTO(
                id,
                title,
                imageLink
        );
    }

    public RecipeDetailDTO toRecipeDetailDTO() {
        return new RecipeDetailDTO(
                id,
                title,
                preparation,
                ingredients,
                authentication.getId(),
                authentication.getUsername(),
                imageLink
        );
    }

}
