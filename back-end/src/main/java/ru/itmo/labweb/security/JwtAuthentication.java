package ru.itmo.labweb.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.time.Instant;
import java.util.Collections;

public class JwtAuthentication extends AbstractAuthenticationToken {
    private final Instant createdAt;
    private final String username;

    public JwtAuthentication(Instant createdAt, String username) {
        super(Collections.emptyList());
        this.createdAt = createdAt;
        this.username = username;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Instant getDetails() {
        return createdAt;
    }

    @Override
    public String getPrincipal() {
        return username;
    }

    @Override
    public boolean isAuthenticated() {
        return true;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        throw new UnsupportedOperationException();
    }

    @Override
    public String getName() {
        return username;
    }
}
