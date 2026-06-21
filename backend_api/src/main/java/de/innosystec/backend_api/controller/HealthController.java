package de.innosystec.backend_api.controller;

import de.innosystec.backend_api.configuration.ApplicationPropertiesConfig;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final ApplicationPropertiesConfig applicationPropertiesConfig;

    public HealthController(ApplicationPropertiesConfig applicationPropertiesConfig) {
        this.applicationPropertiesConfig = applicationPropertiesConfig;
    }

    @GetMapping("/api/health")
    public Map<String, String> getHealth() {
        return Map.of(
                "application", applicationPropertiesConfig.getName(),
                "version", applicationPropertiesConfig.getVersion(),
                "status", "UP"
        );
    }
}
