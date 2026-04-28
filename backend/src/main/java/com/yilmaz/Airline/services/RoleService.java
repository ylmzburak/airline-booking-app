package com.yilmaz.Airline.services;

import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.dtos.RoleDTO;

import java.util.List;

public interface RoleService {

    Response<?> createRole(RoleDTO roleDTO);
    Response<?> updateRole(RoleDTO roleDTO);
    Response<List<RoleDTO>> getAllRoles();
}
