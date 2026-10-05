package com.embarks.firstjobapp.security;

import com.embarks.firstjobapp.user.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwt;
    private final UserRepository users;

    public JwtAuthFilter(JwtService jwt, UserRepository users) {
        this.jwt = jwt;
        this.users = users;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        var h = req.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) try {
            String email = jwt.subject(h.substring(7));
            var u = users.findByEmailIgnoreCase(email).orElse(null);
            if (u != null && u.isActive())
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(u.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()))));
        } catch (RuntimeException ignored) {
            SecurityContextHolder.clearContext();
        }
        chain.doFilter(req, res);
    }
}
