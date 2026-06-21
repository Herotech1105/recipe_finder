package de.innosystec.backend_api.exception.authentication;

public class AuthenticationNotFoundException extends RuntimeException {
    public AuthenticationNotFoundException(String username) {
        super("No user with name '" + username + "' found");
    }
}
