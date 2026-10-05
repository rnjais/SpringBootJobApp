package com.embarks.firstjobapp.application;

import com.embarks.firstjobapp.job.Job;
import com.embarks.firstjobapp.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "job_applications", uniqueConstraints = @UniqueConstraint(name = "uk_application_job_applicant", columnNames = {"job_id", "applicant_id"}))
@Getter
@Setter
@NoArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id")
    private Job job;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "applicant_id")
    private User applicant;
    @Column(nullable = false, length = 500)
    private String resumeUrl;
    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.APPLIED;
    @Column(nullable = false, updatable = false)
    private Instant appliedAt;

    @PrePersist
    void create() {
        appliedAt = Instant.now();
    }
}
