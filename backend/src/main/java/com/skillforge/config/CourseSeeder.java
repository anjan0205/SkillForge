package com.skillforge.config;

import com.skillforge.model.Course;
import com.skillforge.model.Module;
import com.skillforge.model.Lesson;
import com.skillforge.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.ArrayList;

@Component
@Order(2)
public class CourseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(CourseSeeder.class);

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            logger.info("Database is empty. Seeding 6 popular, curated executive courses...");

            // Course 1: Strategic Leadership & Market Disruption
            Course course1 = Course.builder()
                    .title("Strategic Leadership & Market Disruption")
                    .description("The masterclass on high-impact executive planning, disruptive market playbooks, and building resilient scaling architectures in hyper-competitive markets.")
                    .category("Strategy")
                    .thumbnail("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60")
                    .price(299.00)
                    .isFree(false)
                    .instructorId("admin@skillforge.com")
                    .modules(Arrays.asList(
                            Module.builder()
                                    .id("c1m1")
                                    .title("Module 1: Foundations of Cognitive Bias & Disruption")
                                    .description("Exploring the deep roots of disruptive innovations and high-stakes market entries.")
                                    .lessons(Arrays.asList(
                                            Lesson.builder().id("c1m1l1").title("1.1 Executive Summary").content("Welcome to executive strategic theory.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build(),
                                            Lesson.builder().id("c1m1l2").title("1.2 Market Disruption Dynamics").content("Analysis of disruptive market triggers.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build()
                                    ))
                                    .build(),
                            Module.builder()
                                    .id("c1m2")
                                    .title("Module 2: Tactical Team Operations")
                                    .description("Building high-performing cross-functional execution systems.")
                                    .lessons(Arrays.asList(
                                            Lesson.builder().id("c1m2l1").title("2.1 Building Resilient Teams").content("Managing high-velocity corporate cultures.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build(),
                                            Lesson.builder().id("c1m2l2").title("2.2 Change Management Mastery").content("Navigating critical structural pivots.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build()
                                    ))
                                    .build()
                    ))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Course 2: Generative AI & LLM Systems for Enterprise
            Course course2 = Course.builder()
                    .title("Generative AI & LLM Systems for Enterprise")
                    .description("Designing scalable vector databases, prompt template structures, cognitive agents, and custom fine-tuning pipelines for secure corporate deployments.")
                    .category("Technology")
                    .thumbnail("https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60")
                    .price(349.00)
                    .isFree(false)
                    .instructorId("admin@skillforge.com")
                    .modules(Arrays.asList(
                            Module.builder()
                                    .id("c2m1")
                                    .title("Module 1: Enterprise Vector Topologies")
                                    .description("Setting up robust indexing architectures using PGVector, FAISS, and Qdrant.")
                                    .lessons(Arrays.asList(
                                            Lesson.builder().id("c2m1l1").title("1.1 High-Performance Embedding Strategies").content("Selecting standard model weights for maximum retrieval precision.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build(),
                                            Lesson.builder().id("c2m1l2").title("1.2 Semantic Search Implementations").content("Optimizing cosine similarity queries for sub-10ms results.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build()
                                    ))
                                    .build()
                    ))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Course 3: High-Stakes M&A Negotiation Models
            Course course3 = Course.builder()
                    .title("High-Stakes M&A Negotiation Models")
                    .description("A high-fidelity tactical guide covering corporate valuations, structural term sheet parameters, hostage-style deal architectures, and executive buy-ins.")
                    .category("Strategy")
                    .thumbnail("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60")
                    .price(399.00)
                    .isFree(false)
                    .instructorId("admin@skillforge.com")
                    .modules(Arrays.asList(
                            Module.builder()
                                    .id("c3m1")
                                    .title("Module 1: Strategic Term-Sheet Modeling")
                                    .description("Parsing and negotiating complex corporate terms under asymmetric information constraints.")
                                    .lessons(Arrays.asList(
                                            Lesson.builder().id("c3m1l1").title("1.1 Valuation Dynamics & Game Theory").content("Negotiating valuations with quantitative game models.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").build()
                                    ))
                                    .build()
                    ))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Course 4: Executive Finance & Quantitative Investing
            Course course4 = Course.builder()
                    .title("Executive Finance & Quantitative Investing")
                    .description("A rigorous, mathematical program exploring asset allocations, quantitative risk models, hedging, and algorithmic stock structures.")
                    .category("Finance")
                    .thumbnail("https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60")
                    .price(449.00)
                    .isFree(false)
                    .instructorId("admin@skillforge.com")
                    .modules(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Course 5: Full-Stack SaaS Architecture
            Course course5 = Course.builder()
                    .title("Full-Stack SaaS Architecture")
                    .description("The ultimate technical curriculum to design highly scalable SaaS architectures, structured around caching, load balancing, and secure multi-tenancy.")
                    .category("Technology")
                    .thumbnail("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60")
                    .price(0.0)
                    .isFree(true)
                    .instructorId("admin@skillforge.com")
                    .modules(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Course 6: UI/UX Design Systems & Cognitive Psychology
            Course course6 = Course.builder()
                    .title("UI/UX Design Systems & Cognitive Psychology")
                    .description("A professional study of user flows, dynamic typography setups, interaction blueprints, and advanced psychological principles of conversion.")
                    .category("Design")
                    .thumbnail("https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60")
                    .price(199.00)
                    .isFree(false)
                    .instructorId("admin@skillforge.com")
                    .modules(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            courseRepository.saveAll(Arrays.asList(course1, course2, course3, course4, course5, course6));
            logger.info("Successfully seeded 6 premium courses into the SkillForge database.");
        } else {
            logger.info("Courses already exist. Seeding skipped.");
        }
    }
}
