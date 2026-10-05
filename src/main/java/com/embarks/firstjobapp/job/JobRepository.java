package com.embarks.firstjobapp.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findTop6ByOrderByCreatedAtDesc();

    List<Job> findByPostedByIdOrderByCreatedAtDesc(Long userId);
}
