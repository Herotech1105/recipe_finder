package de.innosystec.backend_api.model.storage;

import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.Amount;
import de.innosystec.backend_api.model.recipe.Ingredient;
import jakarta.persistence.*;

@Entity
@Table(name = "user_storage_items")
public class UserStorageItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Authentication authentication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Embedded
    private Amount amount;

    protected UserStorageItem() {
    }

    public UserStorageItem(Authentication authentication, Ingredient ingredient, Amount amount) {
        this.authentication = authentication;
        this.ingredient = ingredient;
        this.amount = amount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Authentication getAuthentication() {
        return authentication;
    }

    public void setAuthentication(Authentication authentication) {
        this.authentication = authentication;
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public Amount getAmount() {
        return amount;
    }

    public void setAmount(Amount amount) {
        this.amount = amount;
    }
}