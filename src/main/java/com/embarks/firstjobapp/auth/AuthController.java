package com.embarks.firstjobapp.auth;

import com.embarks.firstjobapp.user.*;
import com.embarks.firstjobapp.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    private AuthResponse response(User u) {
        return new AuthResponse(jwt.generate(u), "Bearer", jwt.expirationSeconds(), new UserView(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest r) {
        if (users.existsByEmailIgnoreCase(r.email()))
            throw new IllegalArgumentException("An account with this email already exists");
        if (r.role() == Role.ADMIN) throw new IllegalArgumentException("Admin accounts cannot be self-registered");
        User u = new User();
        u.setEmail(r.email());
        u.setPassword(encoder.encode(r.password()));
        u.setFirstName(r.firstName());
        u.setLastName(r.lastName());
        u.setRole(r.role());
        return ResponseEntity.status(HttpStatus.CREATED).body(response(users.save(u)));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) {
        User u = users.findByEmailIgnoreCase(r.email()).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!u.isActive() || !encoder.matches(r.password(), u.getPassword()))
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return response(u);
    }

    @GetMapping("/me")
    public UserView me(Authentication authentication) {
        User u = users.findByEmailIgnoreCase(authentication.getName()).orElseThrow(() -> new java.util.NoSuchElementException("User not found"));
        return new UserView(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRole());
    }

    @PutMapping("/me")
    public UserView updateProfile(@Valid @RequestBody ProfileRequest request, Authentication authentication) {
        User u = users.findByEmailIgnoreCase(authentication.getName()).orElseThrow(() -> new java.util.NoSuchElementException("User not found"));
        u.setFirstName(request.firstName().trim());
        u.setLastName(request.lastName().trim());
        u = users.save(u);
        return new UserView(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRole());
    }

    public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(min = 10, max = 72) String password,
                                  @NotBlank @Size(max = 80) String firstName, @NotBlank @Size(max = 80) String lastName,
                                  @NotNull Role role) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {
    }

    public record ProfileRequest(@NotBlank @Size(max = 80) String firstName,
                                 @NotBlank @Size(max = 80) String lastName) {
    }

    public record AuthResponse(String token, String tokenType, long expiresIn, UserView user) {
    }

    public record UserView(Long id, String email, String firstName, String lastName, Role role) {
    }
}
