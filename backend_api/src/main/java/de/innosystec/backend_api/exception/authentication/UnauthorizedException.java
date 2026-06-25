package de.innosystec.backend_api.exception.authentication;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException() {
        super("You are not authorized for this action");
    }
}
