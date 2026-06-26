package de.innosystec.backend_api.util;

import de.innosystec.backend_api.exception.external.OpenFoodFactsNotReachableException;
import de.innosystec.backend_api.model.external.OpenFoodFactsResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import java.util.Optional;

@Component
public class IngredientValidationUtil {
    private final RestClient restClient;

    public IngredientValidationUtil(@Qualifier("openFoodFactsRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public Optional<Double> getKcalByIngredientName(String ingredientName) {
        try {
            OpenFoodFactsResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("q", ingredientName)
                            .queryParam("fields", "code,product_name,nutriments")
                            .queryParam("page_size", 1)
                            .build())
                    .retrieve()
                    .body(OpenFoodFactsResponse.class);

            if (response != null && response.products() != null && !response.products().isEmpty()) {
                var firstProduct = response.products().getFirst();
                if (firstProduct.nutriments() != null && firstProduct.nutriments().energyKcal100g() != null) {
                    return Optional.of(firstProduct.nutriments().energyKcal100g());
                }
            }
        } catch (HttpStatusCodeException | ResourceAccessException e) {
            System.err.println("API Call failed: " + e.getMessage());
            throw new OpenFoodFactsNotReachableException();
        }
        return Optional.empty();
    }
}