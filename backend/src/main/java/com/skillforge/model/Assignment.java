package com.skillforge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "assignments")
public class Assignment {
    
    @Id
    private String id;
    private String courseId;
    private String title;
    private String description;
    private Integer totalMarks;
    
    private LocalDateTime dueDate;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
