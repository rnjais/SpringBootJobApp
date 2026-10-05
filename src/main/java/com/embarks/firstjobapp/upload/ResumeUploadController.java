package com.embarks.firstjobapp.upload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/uploads")
public class ResumeUploadController {
    private final Path root;

    public ResumeUploadController(@Value("${app.upload-dir:uploads}") String dir) {
        root = Paths.get(dir).toAbsolutePath().normalize();
    }

    @PostMapping("/resume")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file, Authentication auth) throws Exception {
        if (file.isEmpty() || file.getSize() > 5 * 1024 * 1024)
            throw new IllegalArgumentException("Resume must be a non-empty file no larger than 5 MB");
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "");
        String ext = original.toLowerCase(Locale.ROOT).substring(original.lastIndexOf('.') + 1);
        if (!Set.of("pdf", "doc", "docx").contains(ext))
            throw new IllegalArgumentException("Resume must be a PDF, DOC, or DOCX file");
        Files.createDirectories(root);
        String name = UUID.randomUUID() + "." + ext;
        Files.copy(file.getInputStream(), root.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        return Map.of("resumeUrl", "/api/v1/uploads/resume/" + name);
    }

    @GetMapping("/resume/{name}")
    public ResponseEntity<byte[]> download(@PathVariable String name, Authentication auth) throws Exception {
        if (name.contains("/") || name.contains("\\") || name.contains(".."))
            throw new IllegalArgumentException("Invalid file name");
        Path file = root.resolve(name).normalize();
        if (!file.startsWith(root) || !Files.exists(file)) throw new NoSuchElementException("Resume not found");
        String ext = name.substring(name.lastIndexOf('.') + 1);
        MediaType type = ext.equals("pdf") ? MediaType.APPLICATION_PDF : MediaType.APPLICATION_OCTET_STREAM;
        return ResponseEntity.ok().contentType(type).header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + name + "\"").body(Files.readAllBytes(file));
    }
}
