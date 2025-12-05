package com.example.crud.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiErrorHandler {

    @ExceptionHandler(HabitacionNoDisponibleException.class)
    public ResponseEntity<Map<String, Object>> handleHabitacionOcupada(HabitacionNoDisponibleException ex,
                                                                       HttpServletRequest req) {
        Map<String, Object> body = base(
                HttpStatus.CONFLICT, // 409
                "HABITACION_OCUPADA",
                ex.getMessage(),
                req.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    private Map<String, Object> base(HttpStatus status, String code, String message, String path) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", code);
        body.put("message", message);
        body.put("path", path);
        return body;
    }

    // 1) Errores de @Valid en @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex,
                                                                HttpServletRequest req) {
        Map<String, Object> body = base(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "Hay campos inválidos. Corrige e intenta nuevamente.",
                req.getRequestURI()
        );

        Map<String, String> fields = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fe ->
                fields.put(fe.getField(), fe.getDefaultMessage())
        );
        body.put("fields", fields);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    // 2) JSON inválido / enum inválido / fecha mal formateada, etc.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleBadJson(HttpMessageNotReadableException ex,
                                                             HttpServletRequest req) {
        String msg = "Cuerpo de la petición inválido (JSON o tipos).";
        Map<String, Object> body = base(HttpStatus.BAD_REQUEST, "BAD_REQUEST", msg, req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
   
    // 3) Violaciones de unicidad u otras integridades -> 409 (nivel BD)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex,
                                                                   HttpServletRequest req) {
        String msg = "Conflicto de datos (posible duplicado).";
        Throwable root = ex.getMostSpecificCause();
        if (root != null && root.getMessage() != null &&
                root.getMessage().toLowerCase().contains("duplicate entry")) {
            msg = "Documento ya existe para ese tipo y número.";
        }
        Map<String, Object> body = base(HttpStatus.CONFLICT, "CONFLICT", msg, req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    } 

    // 3.b) Documento duplicado desde la lógica de negocio (GestorHuespedes)
    @ExceptionHandler(DocumentoDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleDocumentoDuplicado(DocumentoDuplicadoException ex,
                                                                        HttpServletRequest req) {
        Map<String, Object> body = base(
                HttpStatus.CONFLICT,
                "DOCUMENTO_DUPLICADO",
                ex.getMessage(),
                req.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
    // 3.c) Recurso no encontrado (404)
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(RecursoNoEncontradoException ex,
                                                              HttpServletRequest req) {
        Map<String, Object> body = base(
                HttpStatus.NOT_FOUND,
                "NOT_FOUND",
                ex.getMessage(),
                req.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    // 2.b) Validaciones de @Validated en parámetros (no @RequestBody)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex,
                                                                         HttpServletRequest req) {
        Map<String, Object> body = base(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "Parámetros inválidos.",
                req.getRequestURI()
        );
        Map<String, String> fields = new HashMap<>();
        ex.getConstraintViolations().forEach(v ->
                fields.put(v.getPropertyPath().toString(), v.getMessage())
        );
        body.put("fields", fields);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    // 4) Fallback general
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex, HttpServletRequest req) {
        Map<String, Object> body = base(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Ha ocurrido un error inesperado.",
                req.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
}
