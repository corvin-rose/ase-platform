package de.corvinrose.ase.service;

import de.corvinrose.ase.model.Shader;
import de.corvinrose.ase.repository.ShaderRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShaderService {

	private final ShaderRepository shaderRepository;

	@Autowired
	public ShaderService(ShaderRepository shaderRepository) {
		this.shaderRepository = shaderRepository;
	}

	public Shader addShader(Shader shader) {
		return shaderRepository.save(shader);
	}

	public List<Shader> findAllShaders() {
		return shaderRepository.findAll();
	}

	public Shader updateShader(Shader shader) {
		return shaderRepository.save(shader);
	}

	public Optional<Shader> findShaderById(UUID id) {
		return shaderRepository.findShaderById(id);
	}

	public void deleteShader(UUID id) {
		shaderRepository.deleteShaderById(id);
	}
}
