package de.innosystec.backend_api.exception.external;

public class OpenFoodFactsNotReachableException extends RuntimeException {
    public OpenFoodFactsNotReachableException() {
        super("Open Food Facts is currently unavailable");
    }
}
