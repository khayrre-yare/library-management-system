package com.jamhuriya.library.security;

import com.jamhuriya.library.entity.AppUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final long expiryHours;

    public JwtService(JwtEncoder jwtEncoder,
                      @Value("${app.jwt.issuer}") String issuer,
                      @Value("${app.jwt.expiry-hours}") long expiryHours) {
        this.jwtEncoder = jwtEncoder;
        this.issuer = issuer;
        this.expiryHours = expiryHours;
    }

    public String generateToken(AppUser user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(expiryHours, ChronoUnit.HOURS))
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("name", user.getFullName())
                .claim("role", user.getRole().name())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
