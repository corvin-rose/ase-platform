package de.corvinrose.ase.model;

import java.io.Serializable;
import java.util.Date;
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
@Table(name = "shader")
public class Shader implements Serializable {

	@Id
	@GeneratedValue(generator = "UUID")
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "shader_code", nullable = false)
	private String shaderCode;

	@Column(name = "preview_img")
	private String previewImg;

	@Column(name = "author_id", nullable = false)
	private UUID authorId;

	@Column(name = "created_at", updatable = false)
	private Date createdAt;

	@Column(name = "likes", columnDefinition = "integer default 0")
	private int likes;

	public Shader() {}

	public Shader(
			UUID id,
			String title,
			String shaderCode,
			String previewImg,
			UUID authorId,
			Date createdAt,
			int likes) {
		this.id = id;
		this.title = title;
		this.shaderCode = shaderCode;
		this.previewImg = previewImg;
		this.authorId = authorId;
		this.createdAt = createdAt;
		this.likes = likes;
	}

	@PrePersist
	protected void prePersist() {
		if (this.createdAt == null) {
			this.createdAt = new Date();
		}
	}
}
