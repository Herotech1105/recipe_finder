package de.innosystec.backend_api.exception;

public class CredentialsAlreadyTakenException extends RuntimeException {
    public CredentialsAlreadyTakenException(String field, String value) {
        super("The " + field + " '" + value + "' is already taken");
    }
}
