package com.yilmaz.Airline.dtos;

import lombok.Data;

import java.util.List;

@Data
public class LoginResponse {
    private String token;
    private List<String> roles;

}
