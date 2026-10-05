package com.embarks.firstjobapp.application;

import com.embarks.firstjobapp.job.JobRepository;
import com.embarks.firstjobapp.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {
    private final ApplicationRepository applications;
    private final JobRepository jobs;
    private final UserRepository users;

    public ApplicationController(ApplicationRepository a, JobRepository j, UserRepository u) {
        applications = a;
        jobs = j;
        users = u;
    }

    private ApplicationView view(JobApplication a) {
        return new ApplicationView(a.getId(), a.getJob().getId(), a.getJob().getTitle(), a.getJob().getCompanyName(), a.getApplicant().getFirstName() + " " + a.getApplicant().getLastName(), a.getApplicant().getEmail(), a.getResumeUrl(), a.getCoverLetter(), a.getStatus(), a.getAppliedAt());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationView apply(@Valid @RequestBody ApplyRequest r, @RequestParam Long jobId, Authentication auth) {
        var applicant = users.findByEmailIgnoreCase(auth.getName()).orElseThrow();
        var job = jobs.findById(jobId).orElseThrow(() -> new NoSuchElementException("Job not found"));
        if (applications.existsByJobIdAndApplicantId(jobId, applicant.getId()))
            throw new IllegalArgumentException("You have already applied to this job");
        var a = new JobApplication();
        a.setJob(job);
        a.setApplicant(applicant);
        a.setResumeUrl(r.resumeUrl());
        a.setCoverLetter(r.coverLetter());
        return view(applications.save(a));
    }

    @GetMapping("/me")
    public List<ApplicationView> mine(Authentication a) {
        var u = users.findByEmailIgnoreCase(a.getName()).orElseThrow();
        return applications.findByApplicantIdOrderByAppliedAtDesc(u.getId()).stream().map(this::view).toList();
    }

    @GetMapping("/recruiter")
    public List<ApplicationView> recruiter(Authentication a) {
        var u = users.findByEmailIgnoreCase(a.getName()).orElseThrow();
        return applications.findByJobPostedByIdOrderByAppliedAtDesc(u.getId()).stream().map(this::view).toList();
    }

    @PatchMapping("/{id}/status")
    public ApplicationView status(@PathVariable Long id, @Valid @RequestBody StatusRequest r, Authentication auth) {
        var application = applications.findById(id).orElseThrow(() -> new NoSuchElementException("Application not found"));
        if (!application.getJob().getPostedBy().getEmail().equalsIgnoreCase(auth.getName()) && !auth.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals("ROLE_ADMIN")))
            throw new AccessDeniedException("You cannot update this application");
        application.setStatus(r.status());
        return view(applications.save(application));
    }

    public record ApplyRequest(@NotBlank @Size(max = 500) String resumeUrl, @Size(max = 10000) String coverLetter) {
    }

    public record StatusRequest(@NotNull ApplicationStatus status) {
    }

    public record ApplicationView(Long id, Long jobId, String jobTitle, String companyName, String applicantName,
                                  String applicantEmail, String resumeUrl, String coverLetter, ApplicationStatus status,
                                  java.time.Instant appliedAt) {
    }
}
