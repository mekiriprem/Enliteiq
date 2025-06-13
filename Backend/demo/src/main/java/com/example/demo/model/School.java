package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "schools")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schoolRegistrationId;

    private String areYou;
    private String yourName;
    private String yourEmail;
    private String yourMobile;

    private String schoolName;
    private String schoolAddress;
    private String schoolCity;
    private String schoolState;
    private String schoolCountry;
    private String schoolPincode;
    private String schoolEmail;
    private String schoolPhone;

    private String principalName;
    private String principalContact;

//    private String password;
    private String status = "inactive";
}
