package com.sgd.club.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class VenueCreateRequest {

    @NotNull(message = "El ID del club no puede ser nulo")
    @Positive(message = "El ID del club debe ser un número positivo")
    private Long clubId;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    private String name;

    @NotBlank(message = "El código no puede estar vacío")
    @Size(min = 3, max = 50, message = "El código debe tener entre 3 y 50 caracteres")
    private String code;

    private String address;

    @Size(max = 50, message = "El teléfono no debe exceder los 50 caracteres")
    private String phone;

    // Getters and Setters
    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
