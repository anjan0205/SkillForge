package com.skillforge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    
    private String id;
    private String title;
    private String content; // text or markdown
    private String videoUrl;
    private String attachmentUrl;
    
}
