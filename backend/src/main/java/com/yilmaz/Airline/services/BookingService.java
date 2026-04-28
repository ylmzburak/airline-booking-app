package com.yilmaz.Airline.services;

import com.yilmaz.Airline.dtos.BookingDTO;
import com.yilmaz.Airline.dtos.CreateBookingRequest;
import com.yilmaz.Airline.dtos.Response;
import com.yilmaz.Airline.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    Response<?> createBooking(CreateBookingRequest createBookingRequest);
    Response<BookingDTO> getBookingById(Long id);
    Response<List<BookingDTO>> getAllBookings();
    Response<List<BookingDTO>> getMyBookings();
    Response<?> updateBookingStatus(Long id, BookingStatus status);
}
