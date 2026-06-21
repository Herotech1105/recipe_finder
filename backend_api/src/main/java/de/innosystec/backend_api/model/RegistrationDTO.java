package de.innosystec.backend_api.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class RegistrationDTO {

    @Size(min = 6, max = 20)
    private String username;

    @Size(min = 6, max = 20)
    private String password;

    @Email
    private String email;

    public RegistrationDTO(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPasswordHash(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
