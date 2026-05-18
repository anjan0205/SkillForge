package com.skillforge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class Course {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String category;
    private String thumbnail;
    
    private Double price;
    private Boolean isFree;
    
    private String instructorId;
    
    @Builder.Default
    private List<Module> modules = new ArrayList<>();
    
    @Builder.Default
    private List<String> enrolledStudentIds = new ArrayList<>();
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
