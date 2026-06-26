package de.innosystec.backend_api.exception_handler;

import de.innosystec.backend_api.exception.storage.InvalidMultiplierException;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Order(0)
@RestControllerAdvice
public class StorageExceptionHandler {
    @ExceptionHandler(InvalidMultiplierException.class)
    public ProblemDetail handleOpenFoodFactsNotAvailable(InvalidMultiplierException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, exception.getMessage()
        );
        problem.setTitle("Invalid Multiplier");
        return problem;
    }
}
