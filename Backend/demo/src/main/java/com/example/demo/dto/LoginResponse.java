
package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String role;
    private Object data; // Can be SalesMan, Admin, School, or User
}
