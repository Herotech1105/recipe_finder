package de.innosystec.backend_api.model.recipe;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;

@Entity
public class Ingredient {
    @Id
    @GeneratedValue
    private Long id;

    @Size(min = 1, max = 30)
    private String name;

    protected Ingredient() {
    }

    public Ingredient(String name) {
        this.name = name;
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
        return this.id.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        Ingredient otherIngredient = (Ingredient) other;
        return otherIngredient.id.equals(this.id);
    }

}
