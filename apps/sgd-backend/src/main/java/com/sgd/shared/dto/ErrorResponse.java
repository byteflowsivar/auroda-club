package com.sgd.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response structure for all API errors.
 * Follows the contract specifications for error handling.
 */
public class ErrorResponse {

    @JsonProperty("error")
    private ErrorDetail error;

    // Constructors
    public ErrorResponse() {}

    public ErrorResponse(ErrorDetail error) {
        this.error = error;
    }

    public ErrorResponse(String code, String message) {
        this.error = new ErrorDetail(code, message);
    }

    public ErrorResponse(String code, String message, List<ValidationError> details) {
        this.error = new ErrorDetail(code, message, details);
    }

    public ErrorResponse(String code, String message, String path, String method) {
        this.error = new ErrorDetail(code, message, path, method);
    }

    // Getters and Setters
    public ErrorDetail getError() {
        return error;
    }

    public void setError(ErrorDetail error) {
        this.error = error;
    }

    /**
     * Detailed error information.
     */
    public static class ErrorDetail {
        private String code;
        private String message;
        private List<ValidationError> details;
        private LocalDateTime timestamp;
        private String path;
        private String method;
        private String correlationId;

        public ErrorDetail() {
            this.timestamp = LocalDateTime.now();
        }

        public ErrorDetail(String code, String message) {
            this();
            this.code = code;
            this.message = message;
        }

        public ErrorDetail(String code, String message, List<ValidationError> details) {
            this(code, message);
            this.details = details;
        }

        public ErrorDetail(String code, String message, String path, String method) {
            this(code, message);
            this.path = path;
            this.method = method;
        }

        public ErrorDetail(String code, String message, List<ValidationError> details, 
                          String path, String method, String correlationId) {
            this(code, message, details);
            this.path = path;
            this.method = method;
            this.correlationId = correlationId;
        }

        // Getters and Setters
        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public List<ValidationError> getDetails() {
            return details;
        }

        public void setDetails(List<ValidationError> details) {
            this.details = details;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }

        public String getCorrelationId() {
            return correlationId;
        }

        public void setCorrelationId(String correlationId) {
            this.correlationId = correlationId;
        }
    }

    /**
     * Validation error detail for specific field errors.
     */
    public static class ValidationError {
        private String field;
        private String message;
        private Object rejectedValue;
        private String code;

        public ValidationError() {}

        public ValidationError(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public ValidationError(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }

        public ValidationError(String field, String message, Object rejectedValue, String code) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
            this.code = code;
        }

        // Getters and Setters
        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Object getRejectedValue() {
            return rejectedValue;
        }

        public void setRejectedValue(Object rejectedValue) {
            this.rejectedValue = rejectedValue;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }
}