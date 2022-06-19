package de.corvinrose.ase.model;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@IdClass(Like.class)
@Table(name = "likes")
public class Like implements Serializable {

    @Id
    @Column(name = "shader_id", nullable = false, updatable = false)
    private UUID shaderId;

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;
}
