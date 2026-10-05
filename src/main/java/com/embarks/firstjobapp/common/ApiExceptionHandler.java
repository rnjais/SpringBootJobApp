package com.embarks.firstjobapp.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    private ResponseEntity<ErrorResponse> body(HttpStatus status, String message, HttpServletRequest req, Map<String, String> details) {
        return ResponseEntity.status(status).body(new ErrorResponse(Instant.now(), status.value(), message, req.getRequestURI(), details));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException e, HttpServletRequest r) {
        Map<String, String> d = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors().forEach(x -> d.put(x.getField(), x.getDefaultMessage()));
        return body(HttpStatus.BAD_REQUEST, "Validation failed", r, d);
    }

    @ExceptionHandler(NoSuchElementException.class)
    ResponseEntity<ErrorResponse> missing(NoSuchElementException e, HttpServletRequest r) {
        return body(HttpStatus.NOT_FOUND, e.getMessage(), r, Map.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ErrorResponse> denied(AccessDeniedException e, HttpServletRequest r) {
        return body(HttpStatus.FORBIDDEN, "Access denied", r, Map.of());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> bad(IllegalArgumentException e, HttpServletRequest r) {
        return body(HttpStatus.BAD_REQUEST, e.getMessage(), r, Map.of());
    }

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    ResponseEntity<ErrorResponse> status(org.springframework.web.server.ResponseStatusException e, HttpServletRequest r) {
        return body(HttpStatus.valueOf(e.getStatusCode().value()), e.getReason() == null ? "Request failed" : e.getReason(), r, Map.of());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ErrorResponse> other(Exception e, HttpServletRequest r) {
        return body(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", r, Map.of());
    }

    public record ErrorResponse(Instant timestamp, int status, String error, String path, Map<String, String> details) {
    }
}
