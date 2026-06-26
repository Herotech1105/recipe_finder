package de.innosystec.backend_api.model.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public record Nutriments(
        @JsonProperty("energy-kcal_100g") Double energyKcal100g
) {
}
