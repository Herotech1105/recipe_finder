package de.innosystec.backend_api.model.recipe;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @Size(min = 1, max = 30)
    private String name;

    private double kcalPer100g;

    protected Ingredient() {
    }

    public Ingredient(String name, double kcalPer100g) {
        this.name = name;
        this.kcalPer100g = kcalPer100g;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Equals and Hashcode for use as map key
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        Ingredient otherIngredient = (Ingredient) other;
        if (this.id == null || otherIngredient.id == null) return false;
        return otherIngredient.id.equals(this.id);
    }

    public IngredientResponseDTO toIngredientResponseDTO() {
        return new IngredientResponseDTO(name, kcalPer100g);
    }

}
