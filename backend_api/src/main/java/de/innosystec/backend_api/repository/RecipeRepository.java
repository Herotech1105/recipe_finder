package de.innosystec.backend_api.repository;

import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.recipe.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Optional<Recipe> findByAuthentication(Authentication authentication);
}
