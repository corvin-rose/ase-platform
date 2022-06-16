package de.corvinrose.ase.service;

import de.corvinrose.ase.model.User;
import de.corvinrose.ase.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	public List<User> findAllUsers() {
		return userRepository.findAll();
	}

	public User updateUser(User user) {
		return userRepository.save(user);
	}

	public Optional<User> findUserById(UUID id) {
		return userRepository.findUserById(id);
	}

	public void deleteUser(UUID id) {
		userRepository.deleteUserById(id);
	}
}
