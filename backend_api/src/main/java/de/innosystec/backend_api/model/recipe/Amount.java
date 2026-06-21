package de.innosystec.backend_api.model.recipe;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Embeddable
public class Amount {
    @NotNull
    private Unit unit;

    @Positive
    @Max(10000)
    private double amount;
}
