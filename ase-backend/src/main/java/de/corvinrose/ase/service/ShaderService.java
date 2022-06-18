package de.corvinrose.ase.service;

import de.corvinrose.ase.model.Shader;
import de.corvinrose.ase.repository.ShaderRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ShaderService {

    private final ShaderRepository shaderRepository;

    public Shader addShader(Shader shader) {
        return shaderRepository.save(shader);
    }

    public List<Shader> findAllShaders() {
        return shaderRepository.findAll();
    }

    public Shader updateShader(Shader shader) {
        if (shaderRepository.findShaderById(shader.getId()).isEmpty())
            throw new IllegalArgumentException(
                    "Shader with id " + shader.getId() + " does not exist");
        return shaderRepository.save(shader);
    }

    public Optional<Shader> findShaderById(UUID id) {
        return shaderRepository.findShaderById(id);
    }

    public void deleteShader(UUID id) {
        shaderRepository.deleteShaderById(id);
    }
}
