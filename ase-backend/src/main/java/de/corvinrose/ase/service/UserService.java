package de.corvinrose.ase.service;

import de.corvinrose.ase.model.User;
import de.corvinrose.ase.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public User addUser(User user) {
		return userRepository.save(user);
	}

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
