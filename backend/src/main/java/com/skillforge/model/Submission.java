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
@Document(collection = "submissions")
public class Submission {
    
    @Id
    private String id;
    private String assignmentId;
    private String studentId;
    
    private String content; // Text submission
    private String fileUrl; // Uploaded file link
    
    private Integer marksObtained;
    private String instructorFeedback;
    
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
