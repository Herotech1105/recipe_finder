package de.innosystec.backend_api.exception_handler;


import de.innosystec.backend_api.exception.recipe.RecipeNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RecipeExceptionHandler {
    @ExceptionHandler(RecipeNotFoundException.class)
    public ProblemDetail handleRecipeNotFound(RecipeNotFoundException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, exception.getMessage()
        );
        problem.setTitle("Recipe not found");
        return problem;
    }
}
