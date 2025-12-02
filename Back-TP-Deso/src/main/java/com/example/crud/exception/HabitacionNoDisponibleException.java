package com.example.crud.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class HabitacionNoDisponibleException extends RuntimeException {
    public HabitacionNoDisponibleException(String message) {
        super(message);
    }
}
