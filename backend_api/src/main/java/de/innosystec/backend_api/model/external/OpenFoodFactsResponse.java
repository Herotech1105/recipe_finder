package de.innosystec.backend_api.model.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenFoodFactsResponse(
        @JsonProperty("products") List<Product> products
) {
}