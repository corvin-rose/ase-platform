package de.corvinrose.ase.service;

import de.corvinrose.ase.model.Like;
import de.corvinrose.ase.repository.LikeRepository;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LikeService {

    private LikeRepository likeRepository;

    public List<Like> findAllLikes() {
        return likeRepository.findAll();
    }

    public List<UUID> findAllLikesByShader(UUID shaderId) {
        return likeRepository.findAllLikesByShader(shaderId);
    }

    public List<UUID> findAllLikesByUser(UUID userId) {
        return likeRepository.findAllLikesByUser(userId);
    }

    public Like addLike(Like like) {
        return likeRepository.save(like);
    }

    public void deleteLike(Like like) {
        likeRepository.deleteLikeById(like.getShaderId(), like.getUserId());
    }
}
