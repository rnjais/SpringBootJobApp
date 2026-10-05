package com.embarks.firstjobapp.security;

import com.embarks.firstjobapp.user.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expiration;

    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expiration) {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public String generate(User u) {
        var now = new Date();
        return Jwts.builder().subject(u.getEmail()).claim("role", u.getRole().name()).issuedAt(now).expiration(new Date(now.getTime() + expiration)).signWith(key).compact();
    }

    public String subject(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public long expirationSeconds() {
        return expiration / 1000;
    }
}
