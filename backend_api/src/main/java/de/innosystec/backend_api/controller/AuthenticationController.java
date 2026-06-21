package de.innosystec.backend_api.controller;

import de.innosystec.backend_api.model.LoginRequestDTO;
import de.innosystec.backend_api.model.LoginResponseDTO;
import de.innosystec.backend_api.model.RegistrationDTO;
import de.innosystec.backend_api.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponseDTO register(@Valid @RequestBody RegistrationDTO registrationDTO) {
        return service.validateRegistration(registrationDTO);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO loginRequestDTO){
        return service.authenticateLogin(loginRequestDTO);
    }

}