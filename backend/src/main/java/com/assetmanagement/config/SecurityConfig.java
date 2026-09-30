package com.assetmanagement.config;

import com.assetmanagement.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

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

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "https://*.vercel.app",
                        "*"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf -> csrf.disable())


                // =================================================
                // CORS
                // =================================================

                .cors(cors -> {})


                // =================================================
                // SESSION
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth


                        // =================================================
                        // PUBLIC APIs
                        // =================================================

                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()


                        // =================================================
                        // DASHBOARD DETAILS
                        //
                        // GET /api/dashboard/details
                        //
                        // All three authenticated roles can view
                        // dashboard information.
                        // =================================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/details"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER",
                                "LOGISTICS_OFFICER"
                        )


                        // =================================================
                        // ALL OTHER DASHBOARD APIs
                        // =================================================

                        .requestMatchers(
                                "/api/dashboard/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER",
                                "LOGISTICS_OFFICER"
                        )


                        // =================================================
                        // USERS
                        //
                        // ADMIN ONLY
                        // =================================================

                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // AUDIT LOGS
                        //
                        // ADMIN ONLY
                        // =================================================

                        .requestMatchers(
                                "/api/audit-logs/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // BASES
                        // =================================================

                        // View bases

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/bases/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER",
                                "LOGISTICS_OFFICER"
                        )


                        // Create base

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/bases/**"
                        ).hasRole("ADMIN")


                        // Update base

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/bases/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // Delete base

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/bases/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // =================================================
                        // ASSET TYPES
                        // =================================================

                        // View asset types

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/asset-types/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER",
                                "LOGISTICS_OFFICER"
                        )


                        // Create asset type

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/asset-types/**"
                        ).hasRole("ADMIN")


                        // Update asset type

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/asset-types/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // Delete asset type

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/asset-types/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // =================================================
                        // INVENTORY
                        //
                        // Logistics Officer does NOT get inventory access
                        // under the restricted RBAC requirement.
                        // =================================================

                        // View inventory

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/inventory/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // Create inventory

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/inventory/**"
                        ).hasRole("ADMIN")


                        // Update inventory

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/inventory/**"
                        ).hasRole("ADMIN")


                        // Delete inventory

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/inventory/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // PURCHASES
                        //
                        // ADMIN
                        // BASE COMMANDER
                        // LOGISTICS OFFICER
                        // =================================================

                        .requestMatchers(
                                "/api/purchases/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER",
                                "LOGISTICS_OFFICER"
                        )


                        // =================================================
                        // TRANSFERS
                        //
                        // ADMIN
                        // BASE COMMANDER
                        // LOGISTICS OFFICER
                        // =================================================

                        .requestMatchers(
                                "/api/transfers/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER",
                                "LOGISTICS_OFFICER"
                        )


                        // =================================================
                        // ASSIGNMENTS
                        //
                        // LOGISTICS OFFICER DOES NOT HAVE ACCESS
                        // =================================================

                        .requestMatchers(
                                "/api/assignments/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // =================================================
                        // EXPENDITURES
                        //
                        // LOGISTICS OFFICER DOES NOT HAVE ACCESS
                        // =================================================

                        .requestMatchers(
                                "/api/expenditures/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "BASE_COMMANDER"
                        )


                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================

                        .anyRequest().authenticated()
                )


                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )


                // =================================================
                // DISABLE FORM LOGIN
                // =================================================

                .formLogin(
                        form -> form.disable()
                )


                // =================================================
                // DISABLE BASIC AUTH
                // =================================================

                .httpBasic(
                        basic -> basic.disable()
                );


        return http.build();
    }
}