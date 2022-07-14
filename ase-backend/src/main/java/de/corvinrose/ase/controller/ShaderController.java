package de.corvinrose.ase.controller;

import de.corvinrose.ase.model.Shader;
import de.corvinrose.ase.service.ShaderService;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/shader")
public class ShaderController {

    private final ShaderService shaderService;

    @GetMapping
    public ResponseEntity<List<Shader>> getAllShaders() {
        List<Shader> shaders = shaderService.findAllShaders();
        return new ResponseEntity<>(shaders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shader> getShaderById(@PathVariable("id") UUID id) {
        Shader shader =
                shaderService
                        .findShaderById(id)
                        .orElseThrow(
                                () -> {
                                    throw new IllegalArgumentException(
                                            "No Shader with id " + id.toString() + " exists");
                                });
        return new ResponseEntity<>(shader, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Shader> addShader(@RequestBody Shader shader) {
        Shader newShader = shaderService.addShader(shader);
        return new ResponseEntity<>(newShader, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Shader> updateShader(@RequestBody Shader shader) {
        Shader updatedShader = shaderService.updateShader(shader);
        return new ResponseEntity<>(updatedShader, HttpStatus.OK);
    }

    @PatchMapping("/update")
    public ResponseEntity<Shader> patchUser(@RequestBody Shader shader) {
        return updateShader(shader);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Shader> deleteShader(@PathVariable("id") UUID id) {
        shaderService.deleteShader(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
