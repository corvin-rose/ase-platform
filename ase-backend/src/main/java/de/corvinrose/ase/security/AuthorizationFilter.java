package de.corvinrose.ase.security;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@AllArgsConstructor
public class AuthorizationFilter extends OncePerRequestFilter {

	private final TokenProvider tokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		String requestPath = request.getRequestURI();
		if (List.of(SecurityConfig.AUTHORIZED_REQUESTS).contains(requestPath)) {
			filterChain.doFilter(request, response);
			return;
		}

		String tokenHeader = request.getHeader(SecurityConfig.TOKEN_HEADER);
		if (tokenHeader != null && tokenProvider.isTokenValid(tokenHeader)) {
			filterChain.doFilter(request, response);
			return;
		}
		response.setStatus(HttpStatus.FORBIDDEN.value());
	}
}