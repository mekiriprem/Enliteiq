package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "coordinators")
public class Coordinator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String district;
    private String state;
    private String pinCode;
    private String age;
    private String educationalQualifications;
    private String otherQualifications;
    private String profession;
    private String experienceWithSchools;
    private String reasonToWork;
    private String yearsOfExperience;
    private String principalsKnown;
    private String knowAnyoneInEnlighthiq;
    private String additionalInfo;
    private String howHeardAbout;
}

