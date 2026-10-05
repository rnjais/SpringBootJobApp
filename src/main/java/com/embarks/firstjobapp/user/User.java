package com.embarks.firstjobapp.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name="users", indexes=@Index(name="idx_user_email", columnList="email", unique=true))
@Getter @Setter @NoArgsConstructor
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, unique=true, length=254) private String email;
 @Column(nullable=false) private String password;
 @Column(nullable=false, length=80) private String firstName;
 @Column(nullable=false, length=80) private String lastName;
 @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Role role;
 @Column(nullable=false) private boolean active=true;
 @Column(nullable=false, updatable=false) private Instant createdAt;
 @PrePersist void onCreate(){createdAt=Instant.now(); email=email.toLowerCase().trim();}
}
