package com.yilmaz.Airline.services;

import com.yilmaz.Airline.dtos.CreateFlightRequest;
import com.yilmaz.Airline.dtos.FlightDTO;
import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.enums.City;
import com.yilmaz.Airline.enums.Country;
import com.yilmaz.Airline.enums.FlightStatus;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

public interface FlightService {

    Response<?> createFlight( CreateFlightRequest createFlightRequest);

    Response<FlightDTO> getFlightById(Long id);

    Response<List<FlightDTO>> getAllFlights();

    Response<?> updateFlight(CreateFlightRequest flightRequest);

    Response<List<FlightDTO>> searchFlight(String departureIataCode, String arrivalIataCode, FlightStatus status, LocalDate departureDate);

    Response<List<City>> getAllCities();

    Response<List<Country>> getAllCountries();
}
