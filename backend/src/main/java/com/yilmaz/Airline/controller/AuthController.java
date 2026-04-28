package com.yilmaz.Airline.controller;

import com.yilmaz.Airline.dtos.LoginRequest;
import com.yilmaz.Airline.dtos.LoginResponse;
import com.yilmaz.Airline.dtos.RegistrationRequest;
import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response<?>> register(@Valid @RequestBody
                                                    RegistrationRequest registrationRequest  ){
        return ResponseEntity.ok(authService.register(registrationRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<Response<LoginResponse>> login(@Valid @RequestBody
                                                         LoginRequest loginRequest  ){
        return ResponseEntity.ok(authService.login(loginRequest));
    }



}
