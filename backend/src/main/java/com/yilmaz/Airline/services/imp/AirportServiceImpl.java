package com.yilmaz.Airline.services.imp;

import com.yilmaz.Airline.dtos.AirportDTO;
import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.entities.Airport;
import com.yilmaz.Airline.enums.City;
import com.yilmaz.Airline.enums.Country;
import com.yilmaz.Airline.exceptions.BadRequestException;
import com.yilmaz.Airline.exceptions.NotFoundException;
import com.yilmaz.Airline.repository.AirportRepository;
import com.yilmaz.Airline.services.AirportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AirportServiceImpl implements AirportService {

    private final AirportRepository airportRepository;
    private final ModelMapper modelMapper;

    @Override
    public Response<?> createAirport(AirportDTO airportDTO) {

        log.info("Inside createAirport()");

        Country  country = airportDTO.getCountry();
        City  city = airportDTO.getCity();

        if (!city.getCountry().equals(country)) {
            throw  new BadRequestException("City does not belong to the country");
        }

        Airport airport = modelMapper.map(airportDTO, Airport.class);
        airportRepository.save(airport);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Airport created successfully")
                .build();
    }

    @Override
    public Response<?> updateAirport(AirportDTO airportDTO) {

        log.info("Inside updateAirport()");

        Long id = airportDTO.getId();

        Airport existingAirport = airportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Airport not found"));

        if (airportDTO.getCity() != null){
            if (!existingAirport.getCity().getCountry().equals(airportDTO.getCountry())){
                throw  new BadRequestException("City does not belong to the country");
            }
            existingAirport.setCity(airportDTO.getCity());
        }

        if (airportDTO.getName() != null){
            existingAirport.setName(airportDTO.getName());
        }

        if(airportDTO.getIataCode() != null){
            existingAirport.setIataCode(airportDTO.getIataCode());
        }

        airportRepository.save(existingAirport);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Airport updated successfully")
                .build();

    }

    @Override
    public Response<List<AirportDTO>> getAllAirports() {

        List<AirportDTO> airports = airportRepository.findAll().stream()
                .map(airport -> modelMapper.map(airport, AirportDTO.class))
                .toList();

        return Response.<List<AirportDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message(airports.isEmpty() ? "No airports found" : "Airports retrieved successfully")
                .data(airports)
                .build();
    }

    @Override
    public Response<AirportDTO> getAirportById(Long id) {

        Airport airport = airportRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Airport Not Found"));

        AirportDTO airportDTO = modelMapper.map(airport, AirportDTO.class);

        return Response.<AirportDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message( "Airport retrieved successfully")
                .data(airportDTO)
                .build();
    }
}
