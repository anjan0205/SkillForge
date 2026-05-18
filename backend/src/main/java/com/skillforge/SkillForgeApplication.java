package com.skillforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

// @EnableAsync allows EmailService methods annotated with @Async to run
// in background threads — so emails never block API responses.
@SpringBootApplication
@EnableAsync
public class SkillForgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillForgeApplication.class, args);
    }

}
