package de.innosystec.backend_api.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Base64;

@Configuration
public class OpenFoodFactsApiConfig {

    @Value("${external.open-food-facts.base-url}")
    private String url;

    @Value("${external.open-food-facts.connect-timeout}")
    private int connectTimeout;

    @Value("${external.open-food-facts.read-timeout}")
    private int readTimeout;

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${spring.application.version}")
    private String applicationVersion;

    @Value("${spring.application.developer-mail}")
    private String developerMail;

    @Value("${external.open-food-facts.username}")
    private String username;

    @Value("${external.open-food-facts.password}")
    private String password;

    @Bean
    public RestClient openFoodFactsRestClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(connectTimeout));
        factory.setReadTimeout(Duration.ofMillis(readTimeout));

        String authHeaderValue = "Basic " + Base64.getEncoder()
                .encodeToString((username + ":" + password).getBytes());

        return RestClient.builder()
                .baseUrl(url)
                .requestInterceptor((request, body, execution) -> {
                    request.getHeaders().add("Authorization", authHeaderValue);
                    return execution.execute(request, body);
                })
                .defaultHeader("User-Agent", applicationName + "/" + applicationVersion + " (" + developerMail + ") - Spring Boot RestClient")
                .defaultHeader("Accept", "application/json, text/plain, */*")
                .build();
    }
}