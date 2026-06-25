package de.innosystec.backend_api.configuration;

import de.innosystec.backend_api.model.authentication.RegistrationDTO;
import de.innosystec.backend_api.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
@ConfigurationProperties(prefix = "security.seeder")
public class DataSeeder {

    @Value("admin-password")
    private String adminPassword;
    @Value("demo-password")
    private String demoPassword;

    @Bean
    CommandLineRunner seedAuthentication(AuthenticationService service) {
        return args -> {
            RegistrationDTO adminRegister = new RegistrationDTO("adminUser", adminPassword, "basic.mail@mail.de");
            service.validateRegistration(adminRegister);

            RegistrationDTO demoRegister = new RegistrationDTO("demoUser", demoPassword, "basic.mailTwo@mail.de");
            service.validateRegistration(demoRegister);
        };
    }
}
