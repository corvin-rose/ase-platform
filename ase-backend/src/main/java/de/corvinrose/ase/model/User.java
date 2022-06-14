package de.corvinrose.ase.model;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Getter
@Setter
@Builder
@Entity
@Table(name = "ase_user")
public class User implements Serializable {

	@Id
	@GeneratedValue(generator = "UUID")
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	@Column(name = "email", nullable = false)
	private String email;

	@Column(name = "description")
	private String description;

	@Column(name = "profile_img")
	private String profileImg;

	public User() {}

	public User(
			UUID id,
			String firstName,
			String lastName,
			String email,
			String description,
			String profileImg) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.description = description;
		this.profileImg = profileImg;
	}
}
