package ru.itmo.labweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LabWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(LabWebApplication.class, args);
    }
}
