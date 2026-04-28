package com.yilmaz.Airline.exceptions;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String ex){
        super(ex);
    }
}
