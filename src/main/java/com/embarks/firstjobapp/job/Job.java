package com.embarks.firstjobapp.job;

import com.embarks.firstjobapp.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "jobs", indexes = {@Index(name = "idx_job_location", columnList = "location"), @Index(name = "idx_job_created", columnList = "createdAt")})
@Getter
@Setter
@NoArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 160)
    private String title;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    @Column(nullable = false, length = 160)
    private String companyName;
    @Column(nullable = false, length = 160)
    private String location;
    @Column(length = 100)
    private String salaryRange;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobType jobType;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "posted_by_id")
    private User postedBy;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void create() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void update() {
        updatedAt = Instant.now();
    }
}
