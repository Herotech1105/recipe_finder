package de.innosystec.backend_api.controller;

import de.innosystec.backend_api.model.LoginRequestDTO;
import de.innosystec.backend_api.model.LoginResponseDTO;
import de.innosystec.backend_api.model.RegistrationDTO;
import de.innosystec.backend_api.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public LoginResponseDTO register(@Valid @RequestBody RegistrationDTO registrationDTO) {
        return service.validateRegistration(registrationDTO);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO loginRequestDTO){
        return service.authenticateLogin(loginRequestDTO);
    }

}