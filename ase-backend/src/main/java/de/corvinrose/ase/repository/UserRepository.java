package de.corvinrose.ase.repository;

import de.corvinrose.ase.model.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

	void deleteUserById(UUID id);

	Optional<User> findUserById(UUID id);

	Optional<User> findUserByEmail(String email);
}
