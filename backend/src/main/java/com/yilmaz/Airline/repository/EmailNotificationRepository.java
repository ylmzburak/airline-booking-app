package com.yilmaz.Airline.repository;

import com.yilmaz.Airline.entities.EmailNotification;
import com.yilmaz.Airline.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {


}
