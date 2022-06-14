package de.corvinrose.ase.repository;

import de.corvinrose.ase.model.Shader;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShaderRepository extends JpaRepository<Shader, UUID> {

	void deleteShaderById(UUID id);

	Optional<Shader> findShaderById(UUID id);
}
