package de.innosystec.backend_api.model.authentication;


import de.innosystec.backend_api.model.recipe.Recipe;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
public class Authentication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 6, max = 20)
    private String username;

    @Size(min = 64, max = 80)
    private String passwordHash;

    @Email
    private String email;

    @OneToMany(mappedBy = "authentication",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<Recipe> recipes;

    protected Authentication() {
    }

    public Authentication(String username, String passwordHash, String email) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        Authentication otherAuthentication = (Authentication) other;
        return otherAuthentication.id.equals(this.id);
    }
}
