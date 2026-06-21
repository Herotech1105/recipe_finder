package de.innosystec.backend_api.repository;

import de.innosystec.backend_api.model.authentication.Authentication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthenticationRepository extends JpaRepository<Authentication, Long>  {
    Optional<Authentication> findByUsername(String username);
    Optional<Authentication> findByEmail(String email);
}
