package com.embarks.firstjobapp.job;

import com.embarks.firstjobapp.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.web.PageableDefault;

import java.util.*;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {
    private final JobRepository jobs;
    private final UserRepository users;

    public JobController(JobRepository jobs, UserRepository users) {
        this.jobs = jobs;
        this.users = users;
    }

    public record JobRequest(@NotBlank @Size(max = 160) String title, @NotBlank String description,
                             @NotBlank @Size(max = 160) String companyName, @NotBlank @Size(max = 160) String location,
                             @Size(max = 100) String salaryRange, @NotNull JobType jobType) {
    }

    public record JobView(Long id, String title, String description, String companyName, String location,
                          String salaryRange, JobType jobType, Long recruiterId, String recruiterName,
                          java.time.Instant createdAt, java.time.Instant updatedAt) {
    }

    private JobView view(Job j) {
        return new JobView(j.getId(), j.getTitle(), j.getDescription(), j.getCompanyName(), j.getLocation(), j.getSalaryRange(), j.getJobType(), j.getPostedBy().getId(), j.getPostedBy().getFirstName() + " " + j.getPostedBy().getLastName(), j.getCreatedAt(), j.getUpdatedAt());
    }

    @GetMapping
    public Page<JobView> search(@RequestParam(required = false) String keyword, @RequestParam(required = false) String location, @RequestParam(required = false) JobType jobType, @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable page) {
        Specification<Job> s = (root, q, cb) -> cb.conjunction();
        if (keyword != null && !keyword.isBlank()) {
            var k = "%" + keyword.toLowerCase() + "%";
            s = s.and((r, q, cb) -> cb.or(cb.like(cb.lower(r.get("title")), k), cb.like(cb.lower(r.get("description")), k), cb.like(cb.lower(r.get("companyName")), k)));
        }
        if (location != null && !location.isBlank())
            s = s.and((r, q, cb) -> cb.like(cb.lower(r.get("location")), "%" + location.toLowerCase() + "%"));
        if (jobType != null) s = s.and((r, q, cb) -> cb.equal(r.get("jobType"), jobType));
        return jobs.findAll(s, page).map(this::view);
    }

    @GetMapping("/featured")
    public List<JobView> featured() {
        return jobs.findTop6ByOrderByCreatedAtDesc().stream().map(this::view).toList();
    }

    @GetMapping("/{id}")
    public JobView one(@PathVariable Long id) {
        return view(jobs.findById(id).orElseThrow(() -> new NoSuchElementException("Job not found")));
    }

    @GetMapping("/recruiter/my-jobs")
    public List<JobView> mine(Authentication a) {
        var u = users.findByEmailIgnoreCase(a.getName()).orElseThrow();
        return jobs.findByPostedByIdOrderByCreatedAtDesc(u.getId()).stream().map(this::view).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobView create(@Valid @RequestBody JobRequest r, Authentication a) {
        var u = users.findByEmailIgnoreCase(a.getName()).orElseThrow();
        Job j = new Job();
        copy(r, j);
        j.setPostedBy(u);
        return view(jobs.save(j));
    }

    @PutMapping("/{id}")
    public JobView update(@PathVariable Long id, @Valid @RequestBody JobRequest r, Authentication a) {
        Job j = owned(id, a);
        copy(r, j);
        return view(jobs.save(j));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication a) {
        jobs.delete(owned(id, a));
    }

    private Job owned(Long id, Authentication a) {
        Job j = jobs.findById(id).orElseThrow(() -> new NoSuchElementException("Job not found"));
        if (!j.getPostedBy().getEmail().equalsIgnoreCase(a.getName()) && !a.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals("ROLE_ADMIN")))
            throw new org.springframework.security.access.AccessDeniedException("You cannot modify this job");
        return j;
    }

    private void copy(JobRequest r, Job j) {
        j.setTitle(r.title());
        j.setDescription(r.description());
        j.setCompanyName(r.companyName());
        j.setLocation(r.location());
        j.setSalaryRange(r.salaryRange());
        j.setJobType(r.jobType());
    }
}
