package com.embarks.firstjobapp.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(@org.springframework.beans.factory.annotation.Value("${app.cors-origins}") String origins) {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(java.util.Arrays.stream(origins.split(",")).map(String::trim).toList());
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        c.setExposedHeaders(List.of("Content-Disposition"));
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http, JwtAuthFilter jwt) throws Exception {
        return http.csrf(c -> c.disable()).cors(c -> {
                }).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a -> a
                        .requestMatchers("/api/v1/auth/me").authenticated()
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/jobs", "/api/v1/jobs/*").permitAll()
                        .requestMatchers("/api/v1/jobs/recruiter/**").hasAnyRole("RECRUITER", "ADMIN")
                        .requestMatchers("/api/v1/jobs/**").hasAnyRole("RECRUITER", "ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/applications").hasRole("JOB_SEEKER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/uploads/resume").hasRole("JOB_SEEKER")
                        .requestMatchers("/api/v1/applications/me").hasRole("JOB_SEEKER")
                        .requestMatchers("/api/v1/applications/recruiter/**", "/api/v1/applications/*/status").hasAnyRole("RECRUITER", "ADMIN")
                        .requestMatchers("/api/v1/applications/**").authenticated().anyRequest().authenticated())
                .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class).build();
    }
}
