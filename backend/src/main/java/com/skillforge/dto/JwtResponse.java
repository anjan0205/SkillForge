package com.skillforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
