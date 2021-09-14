package ru.itmo.labweb.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import ru.itmo.labweb.security.JwtProvider;

import java.util.List;


@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ObjectMapper objectMapper;
    private final JwtProvider jwtProvider;

    public WebsocketConfig(ObjectMapper objectMapper, JwtProvider jwtProvider) {
        this.objectMapper = objectMapper;
        this.jwtProvider = jwtProvider;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker( "/all", "/user");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
        resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setObjectMapper(objectMapper);
        converter.setContentTypeResolver(resolver);
        messageConverters.add(converter);
        return false;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {

            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor == null || accessor.getCommand() == null) {
                    return message;
                }

                switch (accessor.getCommand()) {
                    case CONNECT: {
                        List<String> authorization = accessor.getNativeHeader("X-Authorization");

                        if (authorization == null || authorization.isEmpty()) {
                            break;
                        }

                        String token = authorization.get(0);
                        if (jwtProvider.validateAccessToken(token)) {
                            Authentication auth = jwtProvider.getAuthentication(token);

                            if (auth != null) {
                                accessor.setUser(auth);
                            }
                        }

                        break;
                    }

                    case SUBSCRIBE: {
                        String destination = accessor.getDestination();

                        if (destination == null || accessor.getUser() == null) {
                            break;
                        }

                        if (!destination.startsWith("/user")) {
                            break;
                        }

                        String username = accessor.getUser().getName();
                        String prefix = "/user/" + username;

                        if (destination.startsWith(prefix)) {
                            if (destination.length() == prefix.length()) {
                                break;
                            }

                            if (destination.startsWith(prefix + "/")) {
                                break;
                            }
                        }

                        throw new AccessDeniedException("subscription to other users topics isn't allowed");
                    }
                }

                return message;
            }
        });
    }
}
