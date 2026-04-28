package com.yilmaz.Airline.enums;

import lombok.Getter;

@Getter
public enum City {
    // Nigeria
    LAGOS(Country.NIGERIA),
    ABUJA(Country.NIGERIA),

    // USA
    MIAMI(Country.USA),
    DALLAS(Country.USA),

    // UK
    LONDON(Country.UK),
    LEEDS(Country.UK);





    private final Country country;

    City(Country country) {
        this.country = country;
    }
}
