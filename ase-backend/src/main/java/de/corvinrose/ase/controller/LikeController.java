package de.corvinrose.ase.controller;

import de.corvinrose.ase.model.Like;
import de.corvinrose.ase.service.LikeService;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/likes")
public class LikeController {

    private LikeService likeService;

    @GetMapping
    public ResponseEntity<List<Like>> getAllLikes() {
        List<Like> users = likeService.findAllLikes();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/shader/{id}")
    public ResponseEntity<List<UUID>> getAllLikesByShaderId(@PathVariable("id") UUID id) {
        List<UUID> userIds = likeService.findAllLikesByShader(id);
        return new ResponseEntity<>(userIds, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<UUID>> getAllLikesByUserId(@PathVariable("id") UUID id) {
        List<UUID> shaderIds = likeService.findAllLikesByUser(id);
        return new ResponseEntity<>(shaderIds, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Like> addLike(@RequestBody Like like) {
        Like newLike = likeService.addLike(like);
        return new ResponseEntity<>(newLike, HttpStatus.CREATED);
    }

    @Transactional
    @PostMapping("/delete")
    public ResponseEntity<Like> deleteLike(@RequestBody Like like) {
        likeService.deleteLike(like);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
