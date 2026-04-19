package com.xxxpert.xyxarxpert;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String redirectUrl = "/main";

        if (authorities.stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_OWNER") ||
                        a.getAuthority().equals("ROLE_MASTER") ||
                        a.getAuthority().equals("ROLE_ADMIN"))) {

            redirectUrl = "/profile";
        }

        response.sendRedirect(redirectUrl);
    }
}
