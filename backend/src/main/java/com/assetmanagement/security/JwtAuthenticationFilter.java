package com.assetmanagement.security;

import com.assetmanagement.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

@Override
protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain)
    throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null ||
        !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        System.out.println("JWT " + token + " recieved");
        try {
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);
            Integer userId = jwtService.extractUserId(token);

              System.out.println("JWT Email : " + email);
              System.out.println("JWT Role : " + role);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    java.util.Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                            "ROLE_" + role
                        )
                    )
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Authentication set for : " + email);
                System.out.println("Auth Object : " + SecurityContextHolder.getContext().getAuthentication());
            }
        } catch (Exception e) {
            System.out.println("Invalid JWT : " + e.getMessage());
        }
        filterChain.doFilter(request, response);
    }
}