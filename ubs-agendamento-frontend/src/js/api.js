// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

// Classe para gerenciar chamadas da API
class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Se não há conteúdo, retorna null
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Métodos para Pacientes
    async searchPatients(searchTerm) {
        return this.request(`/patients/search?term=${encodeURIComponent(searchTerm)}`);
    }

    async getPatientById(id) {
        return this.request(`/patients/${id}`);
    }

    async getPatientByCpf(cpf) {
        return this.request(`/patients/cpf/${cpf}`);
    }

    async getAllPatients() {
        return this.request('/patients');
    }

    async createPatient(patient) {
        return this.request('/patients', {
            method: 'POST',
            body: JSON.stringify(patient)
        });
    }

    async updatePatient(id, patient) {
        return this.request(`/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(patient)
        });
    }

    async deletePatient(id) {
        return this.request(`/patients/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos para Médicos
    async getAllDoctors() {
        return this.request('/doctors');
    }

    async getDoctorById(id) {
        return this.request(`/doctors/${id}`);
    }

    async getDoctorsBySpecialty(specialty) {
        return this.request(`/doctors/specialty/${encodeURIComponent(specialty)}`);
    }

    async searchDoctorsByName(name) {
        return this.request(`/doctors/search?name=${encodeURIComponent(name)}`);
    }

    async getAllSpecialties() {
        return this.request('/doctors/specialties');
    }

    async createDoctor(doctor) {
        return this.request('/doctors', {
            method: 'POST',
            body: JSON.stringify(doctor)
        });
    }

    async updateDoctor(id, doctor) {
        return this.request(`/doctors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(doctor)
        });
    }

    async deleteDoctor(id) {
        return this.request(`/doctors/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos para Agendamentos
    async getAllAppointments() {
        return this.request('/appointments');
    }

    async getAppointmentById(id) {
        return this.request(`/appointments/${id}`);
    }

    async getAppointmentsByPatient(patientId) {
        return this.request(`/appointments/patient/${patientId}`);
    }

    async getAppointmentsByDoctor(doctorId) {
        return this.request(`/appointments/doctor/${doctorId}`);
    }

    async getAppointmentsByDate(date) {
        return this.request(`/appointments/date/${date}`);
    }

    async getAppointmentsByDoctorAndDate(doctorId, date) {
        return this.request(`/appointments/doctor/${doctorId}/date/${date}`);
    }

    async checkTimeSlotAvailability(doctorId, date, time) {
        return this.request(`/appointments/check-availability?doctorId=${doctorId}&date=${date}&time=${time}`);
    }

    async scheduleAppointment(patientId, doctorId, date, time) {
        return this.request('/appointments/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                patientId: patientId,
                doctorId: doctorId,
                date: date,
                time: time
            })
        });
    }

    async createAppointment(appointment) {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointment)
        });
    }

    async updateAppointmentStatus(id, status) {
        return this.request(`/appointments/${id}/status?status=${encodeURIComponent(status)}`, {
            method: 'PUT'
        });
    }

    async updateAppointment(id, appointment) {
        return this.request(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(appointment)
        });
    }

    async deleteAppointment(id) {
        return this.request(`/appointments/${id}`, {
            method: 'DELETE'
        });
    }

    async getAppointmentsByStatus(status) {
        return this.request(`/appointments/status/${encodeURIComponent(status)}`);
    }
}

// Instância global da API
const api = new ApiService();

