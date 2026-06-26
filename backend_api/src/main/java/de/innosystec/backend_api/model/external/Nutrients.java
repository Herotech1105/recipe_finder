package de.innosystec.backend_api.model.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public record Nutrients(
        @JsonProperty("energy-kcal_100g") double energyKcal100g,
        @JsonProperty("energy-kcal") double energyKcal
) {
}
