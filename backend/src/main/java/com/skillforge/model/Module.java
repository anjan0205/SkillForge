package com.skillforge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Module {
    
    private String id;
    private String title;
    private String description;
    
    @Builder.Default
    private List<Lesson> lessons = new ArrayList<>();
}
