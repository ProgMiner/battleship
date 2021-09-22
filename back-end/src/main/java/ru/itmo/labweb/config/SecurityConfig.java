package ru.itmo.labweb.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import ru.itmo.labweb.security.JwtAuthenticationProvider;
import ru.itmo.labweb.security.JwtConfigurer;
import ru.itmo.labweb.user.UserService;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtConfigurer jwtConfigurer;
    private final UserService userService;
    private final JwtAuthenticationProvider authProvider;

    @Autowired
    public SecurityConfig(JwtConfigurer jwtConfigurer, JwtAuthenticationProvider authProvider, UserService userService) {
        this.jwtConfigurer = jwtConfigurer;
        this.authProvider = authProvider;
        this.userService = userService;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
        auth.authenticationProvider(authProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/user/login", "/api/user/register").permitAll()
                .antMatchers("/api/**").authenticated()
                .and().apply(jwtConfigurer)
                .and().cors();
    }
}
