package com.yilmaz.Airline.repository;

import com.yilmaz.Airline.entities.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {

}
