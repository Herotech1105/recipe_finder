package de.innosystec.backend_api.model.authentication;

import jakarta.validation.constraints.Size;

public class LoginRequestDTO {
    @Size(min = 6, max = 20)
    private String username;

    @Size(min = 6, max = 20)
    private String password;

    public LoginRequestDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPasswordHash(String password) {
        this.password = password;
    }

}
