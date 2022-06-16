package de.corvinrose.ase.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import de.corvinrose.ase.model.User;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
public class TokenProvider {

	@Value("${jwt.secret}")
	private String secret;

	public String generateJwtToken(User user) {
		return JWT.create()
				.withIssuedAt(new Date())
				.withSubject(user.getId().toString())
				.withExpiresAt(
						new Date(System.currentTimeMillis() + SecurityConfig.EXPIRATION_TIME))
				.sign(Algorithm.HMAC512(secret.getBytes()));
	}

	private JWTVerifier getJWTVerifier() {
		JWTVerifier verifier;
		try {
			Algorithm algorithm = Algorithm.HMAC512(secret);
			verifier = JWT.require(algorithm).build();
		} catch (Exception e) {
			throw new JWTVerificationException(SecurityConfig.TOKEN_NOT_VERIFIED_MESSAGE);
		}
		return verifier;
	}

	public Authentication getAuthentication(
			String email, List<GrantedAuthority> authorities, HttpServletRequest request) {
		UsernamePasswordAuthenticationToken authToken =
				new UsernamePasswordAuthenticationToken(email, null, authorities);
		authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		return authToken;
	}

	public boolean isTokenValid(String token) {
		return !getExpirationDate(token).before(new Date());
	}

	public Date getExpirationDate(String token) {
		JWTVerifier verifier = getJWTVerifier();
		return verifier.verify(token).getExpiresAt();
	}

	public String getSubject(String token) {
		JWTVerifier verifier = getJWTVerifier();
		return verifier.verify(token).getSubject();
	}
}
