package de.innosystec.backend_api.exception_handler;


import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.authentication.CredentialsAlreadyTakenException;
import de.innosystec.backend_api.exception.authentication.UnauthorizedException;
import de.innosystec.backend_api.exception.authentication.WrongPasswordException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthenticationExceptionHandler {

    @ExceptionHandler(AuthenticationNotFoundException.class)
    public ProblemDetail handleAuthenticationNotFound(AuthenticationNotFoundException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, exception.getMessage()
        );
        problem.setTitle("User not found");
        return problem;
    }

    @ExceptionHandler(CredentialsAlreadyTakenException.class)
    public ProblemDetail handleCredentialsAlreadyTaken(CredentialsAlreadyTakenException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, exception.getMessage()
        );
        problem.setTitle("Credentials already Taken");
        return problem;
    }

    @ExceptionHandler(WrongPasswordException.class)
    public ProblemDetail handleWrongPassword(WrongPasswordException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, exception.getMessage()
        );
        problem.setTitle("Wrong Password");
        return problem;
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorized(UnauthorizedException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, exception.getMessage()
        );
        problem.setTitle("Unauthorized");
        return problem;
    }

}
