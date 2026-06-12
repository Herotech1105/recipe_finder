package de.innosystec.backend_api.controller;

import de.innosystec.backend_api.configuration.ApplicationPropertiesConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private ApplicationPropertiesConfig applicationPropertiesConfig;

    @GetMapping("/api/health")
    public Map<String, String> getHealth() {
        return Map.of(
                "application", applicationPropertiesConfig.getName(),
                "version", applicationPropertiesConfig.getVersion(),
                "status", "UP"
        );
    }
}
