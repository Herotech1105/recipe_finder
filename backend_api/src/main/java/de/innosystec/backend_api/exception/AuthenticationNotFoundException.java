package de.innosystec.backend_api.exception;

public class AuthenticationNotFoundException extends RuntimeException {
    public AuthenticationNotFoundException(String username) {
        super("No user with name '" + username + "' found");
    }
}
