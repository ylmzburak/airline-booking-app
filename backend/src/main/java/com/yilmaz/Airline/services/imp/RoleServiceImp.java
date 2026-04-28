package com.yilmaz.Airline.services.imp;

import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.dtos.RoleDTO;
import com.yilmaz.Airline.entities.Role;
import com.yilmaz.Airline.exceptions.NotFoundException;
import com.yilmaz.Airline.repository.RoleRepository;
import com.yilmaz.Airline.services.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleServiceImp implements RoleService {

    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;


    @Override
    public Response<?> createRole(RoleDTO roleDTO) {

        log.info("Inside createRole()");

        Role role = modelMapper.map(roleDTO, Role.class);

        role.setName(role.getName().toUpperCase());

        roleRepository.save(role);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Role Created Successfully")
                .build();
    }

    @Override
    public Response<?> updateRole(RoleDTO roleDTO) {

        log.info("Inside updateRole()");

        Long id = roleDTO.getId();

        Role existingRole = roleRepository.findById(id).orElseThrow(() -> new NotFoundException("Role Not Found"));

        existingRole.setName(roleDTO.getName().toUpperCase());
        roleRepository.save(existingRole);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Role Updated Successfully")
                .build();
    }

    @Override
    public Response<List<RoleDTO>> getAllRoles() {
        log.info("Inside getAllRoles()");

        List<RoleDTO> roles = roleRepository.findAll().stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .toList();

        return Response.<List<RoleDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message(roles.isEmpty() ? "Roles Not Found" : "Roles Retrieved Successfully")
                .data(roles)
                .build();
    }
}
