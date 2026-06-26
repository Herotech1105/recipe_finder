package de.innosystec.backend_api.model.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public record Product(
        @JsonProperty("product_name") String productName,
        @JsonProperty("nutriments") Nutriments nutriments
) {
}
