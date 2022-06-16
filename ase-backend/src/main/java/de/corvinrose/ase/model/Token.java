package de.corvinrose.ase.model;

import java.util.Date;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Token {

	private String token;
	private Date expiresAt;
}
