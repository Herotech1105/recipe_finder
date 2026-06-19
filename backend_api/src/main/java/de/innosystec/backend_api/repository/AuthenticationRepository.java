package de.innosystec.backend_api.repository;

import de.innosystec.backend_api.model.Authentication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationRepository extends JpaRepository<Authentication, Long>  {
    Authentication findByUsername(String username);
    Authentication findByEmail(String email);
}
