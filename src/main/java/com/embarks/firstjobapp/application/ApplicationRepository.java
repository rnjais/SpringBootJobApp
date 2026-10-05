package com.embarks.firstjobapp.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantIdOrderByAppliedAtDesc(Long id);

    List<JobApplication> findByJobPostedByIdOrderByAppliedAtDesc(Long id);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
}
