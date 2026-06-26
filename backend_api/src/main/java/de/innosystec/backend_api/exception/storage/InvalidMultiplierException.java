package de.innosystec.backend_api.exception.storage;

public class InvalidMultiplierException extends RuntimeException {
    public InvalidMultiplierException() {
        super("Multiplier must be between 0.1 and 20.0");
    }
}
