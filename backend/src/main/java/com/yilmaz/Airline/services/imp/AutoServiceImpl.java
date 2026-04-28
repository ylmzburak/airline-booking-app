package com.yilmaz.Airline.services.imp;

import com.yilmaz.Airline.dtos.LoginRequest;
import com.yilmaz.Airline.dtos.LoginResponse;
import com.yilmaz.Airline.dtos.RegistrationRequest;
import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.entities.EmailNotification;
import com.yilmaz.Airline.entities.Role;
import com.yilmaz.Airline.entities.User;
import com.yilmaz.Airline.enums.AuthMethod;
import com.yilmaz.Airline.exceptions.BadRequestException;
import com.yilmaz.Airline.exceptions.NotFoundException;
import com.yilmaz.Airline.repository.EmailNotificationRepository;
import com.yilmaz.Airline.repository.RoleRepository;
import com.yilmaz.Airline.repository.UserRepository;
import com.yilmaz.Airline.security.JwtUtils;
import com.yilmaz.Airline.services.AuthService;
import com.yilmaz.Airline.services.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AutoServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils  jwtUtils;
    private final RoleRepository  roleRepository;
    private final EmailNotificationService emailNotificationService;

    @Override
    public Response<?> register(RegistrationRequest registrationRequest) {

        log.info("Inside register()");
        if(userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        List<Role> userRoles;

        if (registrationRequest.getRoles() != null && !registrationRequest.getRoles().isEmpty()) {
            userRoles = registrationRequest.getRoles()
                    .stream()
                    .map(roleName -> roleRepository.findByName(roleName.toUpperCase())
                            .orElseThrow(() -> new NotFoundException("Role " + roleName + "Not Found" )))
                    .toList();
        } else {
            Role defaultRole = roleRepository.findByName("CUSTOMER")
            .orElseThrow(() -> new NotFoundException("Role CUSTOMER DOES NOT EXIST"));
            userRoles = List.of(defaultRole);
        }

        User userToSave = new User();

        userToSave.setName(registrationRequest.getName());
        userToSave.setEmail(registrationRequest.getEmail());
        userToSave.setPhoneNumber(registrationRequest.getPhoneNumber());
        userToSave.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        userToSave.setRoles(userRoles);
        userToSave.setActive(true);
        userToSave.setCreatedAt(LocalDateTime.now());
        userToSave.setUpdatedAt(LocalDateTime.now());
        userToSave.setProvider(AuthMethod.LOCAL);

        User savedUser = userRepository.save(userToSave);

        emailNotificationService.sendWelcomeEmail(savedUser);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("User registered successfully")
                .build();

    }

    @Override
    public Response<LoginResponse> login(LoginRequest loginRequest) {

        log.info("Inside login()");
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email not found"));

        if (!user.isActive()){
            throw new BadRequestException("Account Not Active, Please reach Out to Customer Care ");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(loginRequest.getEmail());

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRoles(roleNames);

        return Response.<LoginResponse>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login successful")
                .data(loginResponse)
                .build();
    }
}
