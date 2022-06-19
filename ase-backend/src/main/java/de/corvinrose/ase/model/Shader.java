package de.corvinrose.ase.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @PrePersist
    protected void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = new Date();
        }
    }
}
