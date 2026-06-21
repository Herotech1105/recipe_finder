package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.CredentialsAlreadyTakenException;
import de.innosystec.backend_api.exception.WrongPasswordException;
import de.innosystec.backend_api.model.Authentication;
import de.innosystec.backend_api.model.LoginRequestDTO;
import de.innosystec.backend_api.model.LoginResponseDTO;
import de.innosystec.backend_api.model.RegistrationDTO;
import de.innosystec.backend_api.repository.AuthenticationRepository;
import de.innosystec.backend_api.util.JWTUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthenticationRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;


    public AuthenticationService(AuthenticationRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JWTUtil jwtUtil) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO validateRegistration(RegistrationDTO registrationDTO) {
        String username = registrationDTO.getUsername();
        if (!isUsernameFree(username)) {
            throw new CredentialsAlreadyTakenException("username", username);
        }
        String email = registrationDTO.getEmail();
        if (!isEmailFree(email)) {
            throw new CredentialsAlreadyTakenException("email", email);
        } else {
            String hash = passwordEncoder.encode(registrationDTO.getPassword());
            Authentication authentication = new Authentication(
                    username,
                    hash,
                    email
            );
            repository.save(authentication);
            return new LoginResponseDTO(username, jwtUtil.generateToken(username));
        }

    }

    public LoginResponseDTO authenticateLogin(LoginRequestDTO loginRequestDTO) {
        String username = loginRequestDTO.getUsername();

        Authentication authentication = repository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationNotFoundException(username));

        String password = loginRequestDTO.getPassword();
        if (!passwordEncoder.matches(password, authentication.getPasswordHash())) {
            throw new WrongPasswordException();
        } else {
            return new LoginResponseDTO(username, jwtUtil.generateToken(username));
        }

    }

    private boolean isUsernameFree(String username) {
        return repository.findByUsername(username).isEmpty();
    }

    private boolean isEmailFree(String email) {
        return repository.findByEmail(email).isEmpty();
    }

}