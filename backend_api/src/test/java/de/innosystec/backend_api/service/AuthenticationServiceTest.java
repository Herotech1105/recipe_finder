package de.innosystec.backend_api.service;

import de.innosystec.backend_api.exception.authentication.AuthenticationNotFoundException;
import de.innosystec.backend_api.exception.authentication.CredentialsAlreadyTakenException;
import de.innosystec.backend_api.exception.authentication.WrongPasswordException;
import de.innosystec.backend_api.model.authentication.Authentication;
import de.innosystec.backend_api.model.authentication.LoginRequestDTO;
import de.innosystec.backend_api.model.authentication.LoginResponseDTO;
import de.innosystec.backend_api.model.authentication.RegistrationDTO;
import de.innosystec.backend_api.repository.AuthenticationRepository;
import de.innosystec.backend_api.util.JWTUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {
    @Mock
    private AuthenticationRepository authenticationRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTUtil jwtUtil;

    @InjectMocks
    private AuthenticationService service;

    private final String username = "username";
    private final String password = "password";
    private final String email = "some.mail@mail.de";
    private final String hash = "nasijfasbdhvfhasbdjcogbansofbosb";
    private final String jwtToken = "jbvihabsofvudavbsliudbifbaisbdiavic";
    private final Authentication authentication = new Authentication(
            username,
            hash,
            email
    );

    // --- REGISTRATION TESTS ---

    @Test
    void createRegistration_Success() {
        RegistrationDTO registrationDTO = mock(RegistrationDTO.class);

        when(registrationDTO.getUsername()).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(registrationDTO.getEmail()).thenReturn(email);
        when(authenticationRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(registrationDTO.getPassword())).thenReturn(hash);
        when(jwtUtil.generateToken(username)).thenReturn(jwtToken);

        LoginResponseDTO result = service.validateRegistration(registrationDTO);

        verify(authenticationRepository).save(any(Authentication.class));

        LoginResponseDTO expectedResult = new LoginResponseDTO(username, jwtToken);
        assertEquals(result.getUsername(), expectedResult.getUsername());
        assertEquals(result.getJwtToken(), expectedResult.getJwtToken());
    }

    @Test
    void createRegistration_ThrowsCredentialsAlreadyTakenExceptionUsername() {
        RegistrationDTO registrationDTO = mock(RegistrationDTO.class);

        when(registrationDTO.getUsername()).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(authentication));

        assertThrows(CredentialsAlreadyTakenException.class, () -> service.validateRegistration(registrationDTO));
        verify(authenticationRepository, never()).save(any());
    }

    @Test
    void createRegistration_ThrowsCredentialsAlreadyTakenExceptionEmail() {
        RegistrationDTO registrationDTO = mock(RegistrationDTO.class);

        when(registrationDTO.getUsername()).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(registrationDTO.getEmail()).thenReturn(email);
        when(authenticationRepository.findByEmail(email)).thenReturn(Optional.of(authentication));

        assertThrows(CredentialsAlreadyTakenException.class, () -> service.validateRegistration(registrationDTO));
        verify(authenticationRepository, never()).save(any());
    }

    @Test
    void authenticateLogin_Success() {
        LoginRequestDTO loginRequestDTO = mock(LoginRequestDTO.class);

        when(loginRequestDTO.getUsername()).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(authentication));
        when(loginRequestDTO.getPassword()).thenReturn(password);
        when(passwordEncoder.matches(password, hash)).thenReturn(true);
        when(jwtUtil.generateToken(username)).thenReturn(jwtToken);

        LoginResponseDTO result = service.authenticateLogin(loginRequestDTO);
        LoginResponseDTO expectedResult = new LoginResponseDTO(username, jwtToken);

        assertEquals(result.getJwtToken(), expectedResult.getJwtToken());
        assertEquals(result.getUsername(), expectedResult.getUsername());
    }

    @Test
    void authenticateLogin_ThrowAuthenticationNotFound() {
        LoginRequestDTO loginRequestDTO = mock(LoginRequestDTO.class);

        when(loginRequestDTO.getUsername()).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(AuthenticationNotFoundException.class, () -> service.authenticateLogin(loginRequestDTO));
    }

    @Test
    void authenticateLogin_ThrowWrongPassword() {
        LoginRequestDTO loginRequestDTO = mock(LoginRequestDTO.class);

        when(loginRequestDTO.getUsername()).thenReturn(username);
        when(authenticationRepository.findByUsername(username)).thenReturn(Optional.of(authentication));
        when(loginRequestDTO.getPassword()).thenReturn(password);
        when(passwordEncoder.matches(password, hash)).thenReturn(false);

        assertThrows(WrongPasswordException.class, () -> service.authenticateLogin(loginRequestDTO));
    }
}
