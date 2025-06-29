package com.ubs.agendamento.repository;

import com.ubs.agendamento.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByCpf(String cpf);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Patient> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT p FROM Patient p WHERE p.id = :id OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Patient> findByIdOrNameContaining(@Param("id") Long id, @Param("searchTerm") String searchTerm);
}

