package com.yilmaz.Airline.services;


import com.yilmaz.Airline.entities.Booking;
import com.yilmaz.Airline.entities.User;

public interface EmailNotificationService {

    void sendBookingTickerEmail(Booking booking);
    void sendWelcomeEmail(User user);

}
