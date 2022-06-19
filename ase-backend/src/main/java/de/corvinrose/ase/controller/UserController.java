package de.corvinrose.ase.controller;

import de.corvinrose.ase.model.Token;
import de.corvinrose.ase.model.User;
import de.corvinrose.ase.service.AuthService;
import de.corvinrose.ase.service.UserService;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUsersById(@PathVariable("id") UUID id) {
        User user =
                userService
                        .findUserById(id)
                        .orElseThrow(
                                () -> {
                                    throw new IllegalArgumentException(
                                            "No User with id " + id.toString() + " exists");
                                });
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User newUser = authService.registerUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Token> loginUser(@RequestBody User user) {
        Token token = authService.loginUser(user);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @PostMapping("/auth")
    public ResponseEntity<User> authUser(@RequestBody Token token) {
        User user = authService.authUserWithToken(token);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        User updatedUser = userService.updateUser(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable("id") UUID id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
