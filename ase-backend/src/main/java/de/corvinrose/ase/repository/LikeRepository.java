package de.corvinrose.ase.repository;

import de.corvinrose.ase.model.Like;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikeRepository extends JpaRepository<Like, Like> {

    @Modifying
    @Query(value = "DELETE FROM likes WHERE shader_id = ?1 AND user_id = ?2", nativeQuery = true)
    void deleteLikeById(UUID shaderId, UUID userId);

    @Query(
            value =
                    "SELECT Cast(u.id as varchar) FROM likes l, ase_user u WHERE l.shader_id = ?1"
                            + " AND u.id = l.user_id",
            nativeQuery = true)
    List<UUID> findAllLikesByShader(UUID shaderId);

    @Query(
            value =
                    "SELECT Cast(s.id as varchar) FROM likes l, shader s WHERE l.user_id = ?1 AND"
                            + " s.id = l.shader_id",
            nativeQuery = true)
    List<UUID> findAllLikesByUser(UUID userId);
}
