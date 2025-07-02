package com.ubs.agendamento.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull(message = "Paciente é obrigatório")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull(message = "Médico é obrigatório")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments"})
    private Doctor doctor;

    @Column(name = "appointment_date", nullable = false)
    @NotNull(message = "Data do agendamento é obrigatória")
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    @NotNull(message = "Horário do agendamento é obrigatório")
    private LocalTime appointmentTime;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'scheduled'")
    private String status = "scheduled";

    // Construtores
    public Appointment() {}

    public Appointment(Patient patient, Doctor doctor, LocalDate appointmentDate, LocalTime appointmentTime) {
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = "scheduled";
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

