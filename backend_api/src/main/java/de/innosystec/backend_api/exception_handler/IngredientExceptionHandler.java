package de.innosystec.backend_api.exception_handler;

import de.innosystec.backend_api.exception.external.IngredientNotFoundException;
import de.innosystec.backend_api.exception.external.OpenFoodFactsNotReachableException;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Order(0)
@RestControllerAdvice
public class IngredientExceptionHandler {
    @ExceptionHandler(OpenFoodFactsNotReachableException.class)
    public ProblemDetail handleOpenFoodFactsNotAvailable(OpenFoodFactsNotReachableException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage()
        );
        problem.setTitle("Open Food Facts not available");
        return problem;
    }

    @ExceptionHandler(IngredientNotFoundException.class)
    public ProblemDetail handleIngredientNotFoundException(IngredientNotFoundException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage()
        );
        problem.setTitle("Open Food Facts not available");
        return problem;
    }
}
