package com.ubs.agendamento.controller;

import com.ubs.agendamento.model.Doctor;
import com.ubs.agendamento.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.findAll();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorService.findById(id);
        return doctor.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<Doctor> doctors = doctorService.findBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctorsByNome(@RequestParam String nome) {
        List<Doctor> doctors = doctorService.findByNome(nome);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/specialties")
    public ResponseEntity<List<String>> getAllSpecialties() {
        List<String> specialties = doctorService.findAllSpecialties();
        return ResponseEntity.ok(specialties);
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody Doctor doctor) {
        try {
            Doctor savedDoctor = doctorService.save(doctor);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @Valid @RequestBody Doctor doctor) {
        if (!doctorService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctor.setId(id);
        Doctor updatedDoctor = doctorService.save(doctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (!doctorService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

