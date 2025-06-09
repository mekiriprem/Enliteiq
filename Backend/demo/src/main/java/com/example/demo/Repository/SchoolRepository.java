package com.example.demo.Repository;

import com.example.demo.model.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchoolRepository extends JpaRepository<School, String> {
    boolean existsBySchoolEmail(String schoolEmail);
     @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
           "FROM School s WHERE s.schoolEmail = :email AND s.schoolRegistrationId != :id")
    boolean existsBySchoolEmailAndNotId(@Param("email") String email, @Param("id") String id);
}