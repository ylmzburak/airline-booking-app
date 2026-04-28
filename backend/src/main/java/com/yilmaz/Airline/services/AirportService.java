package com.yilmaz.Airline.services;

import com.yilmaz.Airline.dtos.AirportDTO;
import com.yilmaz.Airline.dtos.Response;
import jakarta.validation.Valid;

import java.util.List;

public interface AirportService {
    Response<?> createAirport( AirportDTO airportDTO);

    Response<?> updateAirport(AirportDTO airportDTO);

    Response<List<AirportDTO>> getAllAirports();

    Response<AirportDTO> getAirportById(Long id);
}
