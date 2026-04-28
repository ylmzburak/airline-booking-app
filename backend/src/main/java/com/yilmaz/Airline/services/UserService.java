package com.yilmaz.Airline.services;

import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.dtos.UserDTO;
import com.yilmaz.Airline.entities.User;

import java.util.List;

public interface UserService {
    User currentUser();
    Response<?> updateMyAccount(UserDTO userDTO);

    Response<List<UserDTO>> getAllPilots();

    Response<UserDTO> getAccountDetails();
}
