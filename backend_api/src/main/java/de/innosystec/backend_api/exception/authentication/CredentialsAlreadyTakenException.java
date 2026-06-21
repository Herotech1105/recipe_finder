package de.innosystec.backend_api.exception.authentication;

public class CredentialsAlreadyTakenException extends RuntimeException {
    public CredentialsAlreadyTakenException(String field, String value) {
        super("The " + field + " '" + value + "' is already taken");
    }
}
