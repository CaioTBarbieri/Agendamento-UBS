package com.ubs.agendamento.service;

import com.ubs.agendamento.model.Appointment;
import com.ubs.agendamento.model.Doctor;
import com.ubs.agendamento.model.Patient;
import com.ubs.agendamento.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> findByPatientId(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByDateTimeDesc(patientId);
    }

    public List<Appointment> findByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> findByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public List<Appointment> findByDoctorAndDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, date);
    }

    public boolean isTimeSlotAvailable(Long doctorId, LocalDate date, LocalTime time) {
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndDateAndTime(doctorId, date, time);
        return existingAppointments.isEmpty();
    }

    public Appointment scheduleAppointment(Long patientId, Long doctorId, LocalDate date, LocalTime time) {
        Optional<Patient> patient = patientService.findById(patientId);
        Optional<Doctor> doctor = doctorService.findById(doctorId);

        if (patient.isEmpty()) {
            throw new RuntimeException("Paciente não encontrado com ID: " + patientId);
        }

        if (doctor.isEmpty()) {
            throw new RuntimeException("Médico não encontrado com ID: " + doctorId);
        }

        if (!isTimeSlotAvailable(doctorId, date, time)) {
            throw new RuntimeException("Horário não disponível para este médico na data e hora especificadas");
        }

        Appointment appointment = new Appointment(patient.get(), doctor.get(), date, time);
        return appointmentRepository.save(appointment);
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long appointmentId, String status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Agendamento não encontrado com ID: " + appointmentId);
    }

    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> findByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }
}

