package de.corvinrose.ase.service;

import de.corvinrose.ase.model.Token;
import de.corvinrose.ase.model.User;
import de.corvinrose.ase.repository.UserRepository;
import de.corvinrose.ase.security.TokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService implements UserDetailsService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;
  private final TokenProvider tokenProvider;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return userRepository
        .findUserByEmail(email)
        .orElseThrow(
            () -> new UsernameNotFoundException("User with email " + email + "couldn't be found!"));
  }

  public User registerUser(User user) {
    if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
      throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists");
    }

    user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  public Token loginUser(User user) {
    User targetUser =
        userRepository
            .findUserByEmail(user.getEmail())
            .orElseThrow(
                () -> {
                  throw new IllegalArgumentException(
                      "User with email " + user.getEmail() + " does not exist");
                });

    if (!bCryptPasswordEncoder.matches(user.getPassword(), targetUser.getPassword())) {
      throw new IllegalArgumentException("Password is not valid");
    }

    String token = tokenProvider.generateJwtToken(targetUser);
    return Token.builder().token(token).expiresAt(tokenProvider.getExpirationDate(token)).build();
  }

  public User authUserWithToken(Token token) {
    if (!tokenProvider.isTokenValid(token.getToken())) {
      throw new IllegalArgumentException("Token is not valid or expired");
    }

    UUID userId;
    try {
      userId = UUID.fromString(tokenProvider.getSubject(token.getToken()));
    } catch (Exception e) {
      throw new IllegalArgumentException("Token is not valid");
    }

    return userRepository
        .findUserById(userId)
        .orElseThrow(
            () -> {
              throw new IllegalArgumentException("Token does not match with any user");
            });
  }
}
