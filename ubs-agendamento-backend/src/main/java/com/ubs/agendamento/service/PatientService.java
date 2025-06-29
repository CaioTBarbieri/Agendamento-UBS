package com.ubs.agendamento.service;

import com.ubs.agendamento.model.Patient;
import com.ubs.agendamento.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    public Optional<Patient> findById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> findByCpf(String cpf) {
        return patientRepository.findByCpf(cpf);
    }

    public List<Patient> findByName(String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Patient> searchPatients(String searchTerm) {
        try {
            Long id = Long.parseLong(searchTerm);
            return patientRepository.findByIdOrNameContaining(id, searchTerm);
        } catch (NumberFormatException e) {
            return patientRepository.findByNameContainingIgnoreCase(searchTerm);
        }
    }

    public Patient save(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deleteById(Long id) {
        patientRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return patientRepository.existsById(id);
    }

    public boolean existsByCpf(String cpf) {
        return patientRepository.findByCpf(cpf).isPresent();
    }
}

