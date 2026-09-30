package com.assetmanagement.service;

import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secretKey;

    private final long expirationTime = 1000 * 60 * 60;

    public String generateToken(Integer userId, String email, String role) {

        SecretKey key = Keys.hmacShaKeyFor(
            secretKey.getBytes(StandardCharsets.UTF_8)
        );

        return Jwts.builder()
                  .subject(email)
                  .claim("userId", userId)
                  .claim("role", role)
                  .issuedAt(new Date())
                  .expiration(
                    new Date(System.currentTimeMillis() + expirationTime)
                  )
                  .signWith(key)
                  .compact();
    }      

    public String extractEmail(String token) {
        SecretKey key = Keys.hmacShaKeyFor(
            secretKey.getBytes(StandardCharsets.UTF_8)
        );

        return Jwts.parser()
                   .verifyWith(key)
                   .build()
                   .parseSignedClaims(token)
                   .getPayload()
                   .getSubject();
    }

     public String extractRole(String token) {
        SecretKey key = Keys.hmacShaKeyFor(
            secretKey.getBytes(StandardCharsets.UTF_8)
        );

        return Jwts.parser()
                   .verifyWith(key)
                   .build()
                   .parseSignedClaims(token)
                   .getPayload()
                   .get("role", String.class);
    }

    public Integer extractUserId(String token) {
        SecretKey key = Keys.hmacShaKeyFor(
             secretKey.getBytes(StandardCharsets.UTF_8)
        );

        return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .get("userId", Integer.class);
    }
}