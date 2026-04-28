package com.yilmaz.Airline.services;

import com.yilmaz.Airline.dtos.LoginRequest;
import com.yilmaz.Airline.dtos.LoginResponse;
import com.yilmaz.Airline.dtos.RegistrationRequest;
import com.yilmaz.Airline.dtos.Response;
import jakarta.validation.Valid;

public interface AuthService {

    Response<?> register(@Valid RegistrationRequest registrationRequest);

    Response<LoginResponse> login(@Valid LoginRequest loginRequest);
}
