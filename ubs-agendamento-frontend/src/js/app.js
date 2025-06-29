// Aplicação principal
class App {
    constructor() {
        this.selectedPatient = null;
        this.doctors = [];
        this.specialties = [];
        this.appointments = [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupDateInputs();
        await this.loadInitialData();
    }

    setupEventListeners() {
        // Busca de pacientes
        const searchInput = document.getElementById('patient-search');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput && searchBtn) {
            const debouncedSearch = Utils.debounce(() => this.searchPatients(), 500);
            searchInput.addEventListener('input', debouncedSearch);
            searchBtn.addEventListener('click', () => this.searchPatients());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchPatients();
                }
            });
        }

        // Agendamento
        const scheduleBtn = document.getElementById('schedule-btn');
        const clearFormBtn = document.getElementById('clear-form-btn');
        
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => this.scheduleAppointment());
        }
        
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearScheduleForm());
        }

        // Filtros de médico
        const specialtyFilter = document.getElementById('specialty-filter');
        if (specialtyFilter) {
            specialtyFilter.addEventListener('change', () => this.filterDoctorsBySpecialty());
        }

        // Seleção de médico e data
        const doctorSelect = document.getElementById('doctor-select');
        const appointmentDate = document.getElementById('appointment-date');
        
        if (doctorSelect) {
            doctorSelect.addEventListener('change', () => this.updateTimeSlots());
        }
        
        if (appointmentDate) {
            appointmentDate.addEventListener('change', () => this.updateTimeSlots());
        }

        // Filtros de consultas
        const filterAppointmentsBtn = document.getElementById('filter-appointments-btn');
        if (filterAppointmentsBtn) {
            filterAppointmentsBtn.addEventListener('click', () => this.filterAppointments());
        }

        // Modal
        this.setupModalEvents();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sectionName = btn.dataset.section;
                this.showSection(sectionName);
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setupDateInputs() {
        const appointmentDate = document.getElementById('appointment-date');
        const filterDate = document.getElementById('filter-date');
        
        const minDate = Utils.getMinAppointmentDate();
        
        if (appointmentDate) {
            appointmentDate.min = minDate;
        }
        
        if (filterDate) {
            filterDate.value = minDate;
        }
    }

    setupModalEvents() {
        const modal = document.getElementById('patient-modal');
        const closeButtons = modal.querySelectorAll('.modal-close');
        const selectPatientBtn = document.getElementById('select-patient-btn');
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.hideModal());
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
        
        if (selectPatientBtn) {
            selectPatientBtn.addEventListener('click', () => this.selectPatientFromModal());
        }
    }

    showSection(sectionName) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load data when switching to appointments section
            if (sectionName === 'appointments') {
                this.loadAppointments();
            }
        }
    }

    async loadInitialData() {
        try {
            loading.show();
            
            // Carregar médicos e especialidades
            await Promise.all([
                this.loadDoctors(),
                this.loadSpecialties()
            ]);
            
            // Carregar horários disponíveis
            this.loadTimeSlots();
            
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            toast.error('Erro ao carregar dados iniciais');
        } finally {
            loading.hide();
        }
    }

    async loadDoctors() {
        try {
            this.doctors = await api.getAllDoctors();
            this.populateDoctorSelect();
        } catch (error) {
            console.error('Erro ao carregar médicos:', error);
            toast.error('Erro ao carregar lista de médicos');
        }
    }

    async loadSpecialties() {
        try {
            this.specialties = await api.getAllSpecialties();
            this.populateSpecialtyFilter();
        } catch (error) {
            console.error('Erro ao carregar especialidades:', error);
            toast.error('Erro ao carregar especialidades');
        }
    }

    populateDoctorSelect() {
        const select = document.getElementById('doctor-select');
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione um médico...</option>';
        
        this.doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} - ${doctor.specialty}`;
            select.appendChild(option);
        });
    }

    populateSpecialtyFilter() {
        const select = document.getElementById('specialty-filter');
        if (!select) return;
        
        select.innerHTML = '<option value="">Todas as especialidades</option>';
        
        this.specialties.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty;
            option.textContent = specialty;
            select.appendChild(option);
        });
    }

    filterDoctorsBySpecialty() {
        const specialtyFilter = document.getElementById('specialty-filter');
        const selectedSpecialty = specialtyFilter.value;
        
        const filteredDoctors = selectedSpecialty 
            ? this.doctors.filter(doctor => doctor.specialty === selectedSpecialty)
            : this.doctors;
        
        const select = document.getElementById('doctor-select');
        select.innerHTML = '<option value="">Selecione um médico...</option>';
        
        filteredDoctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} - ${doctor.specialty}`;
            select.appendChild(option);
        });
        
        // Reset time slots when doctor filter changes
        this.updateTimeSlots();
    }

    loadTimeSlots() {
        const timeSelect = document.getElementById('appointment-time');
        if (!timeSelect) return;
        
        timeSelect.innerHTML = '<option value="">Selecione um horário...</option>';
        
        const timeSlots = Utils.generateTimeSlots();
        timeSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.label;
            timeSelect.appendChild(option);
        });
    }

    async updateTimeSlots() {
        const doctorSelect = document.getElementById('doctor-select');
        const dateInput = document.getElementById('appointment-date');
        const timeSelect = document.getElementById('appointment-time');
        
        if (!doctorSelect.value || !dateInput.value) {
            this.loadTimeSlots();
            this.updateScheduleButton();
            return;
        }
        
        try {
            // Get existing appointments for the selected doctor and date
            const appointments = await api.getAppointmentsByDoctorAndDate(doctorSelect.value, dateInput.value);
            const bookedTimes = appointments.map(apt => apt.appointmentTime.substring(0, 5));
            
            timeSelect.innerHTML = '<option value="">Selecione um horário...</option>';
            
            const timeSlots = Utils.generateTimeSlots();
            timeSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot.value;
                option.textContent = slot.label;
                
                if (bookedTimes.includes(slot.value)) {
                    option.disabled = true;
                    option.textContent += ' (Ocupado)';
                }
                
                timeSelect.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erro ao carregar horários:', error);
            this.loadTimeSlots();
        }
        
        this.updateScheduleButton();
    }

    updateScheduleButton() {
        const scheduleBtn = document.getElementById('schedule-btn');
        const doctorSelect = document.getElementById('doctor-select');
        const dateInput = document.getElementById('appointment-date');
        const timeSelect = document.getElementById('appointment-time');
        
        const isValid = this.selectedPatient && 
                       doctorSelect.value && 
                       dateInput.value && 
                       timeSelect.value;
        
        scheduleBtn.disabled = !isValid;
    }

    async searchPatients() {
        const searchInput = document.getElementById('patient-search');
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            this.clearSearchResults();
            return;
        }
        
        try {
            loading.show();
            const patients = await api.searchPatients(searchTerm);
            this.displaySearchResults(patients);
        } catch (error) {
            console.error('Erro na busca:', error);
            toast.error('Erro ao buscar pacientes');
            this.clearSearchResults();
        } finally {
            loading.hide();
        }
    }

    displaySearchResults(patients) {
        const container = document.getElementById('search-results');
        
        if (!patients || patients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-slash"></i>
                    <h3>Nenhum paciente encontrado</h3>
                    <p>Tente buscar por outro termo</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = patients.map(patient => `
            <div class="patient-card" data-patient-id="${patient.id}">
                <div class="patient-info">
                    <div class="info-item">
                        <span class="info-label">Nome</span>
                        <span class="info-value">${Utils.escapeHtml(patient.name)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">CPF</span>
                        <span class="info-value">${Utils.formatCpf(patient.cpf)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Data de Nascimento</span>
                        <span class="info-value">${Utils.formatDate(patient.dateOfBirth)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Telefone</span>
                        <span class="info-value">${Utils.formatPhone(patient.phoneNumber)}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-select-patient" data-patient-id="${patient.id}">
                        <i class="fas fa-check"></i>
                        Selecionar
                    </button>
                    <button class="btn btn-secondary btn-view-patient" data-patient-id="${patient.id}">
                        <i class="fas fa-eye"></i>
                        Detalhes
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.btn-select-patient').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = parseInt(e.target.dataset.patientId);
                const patient = patients.find(p => p.id === patientId);
                this.selectPatient(patient);
            });
        });
        
        container.querySelectorAll('.btn-view-patient').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = parseInt(e.target.dataset.patientId);
                const patient = patients.find(p => p.id === patientId);
                this.showPatientModal(patient);
            });
        });
    }

    clearSearchResults() {
        const container = document.getElementById('search-results');
        container.innerHTML = '';
    }

    selectPatient(patient) {
        this.selectedPatient = patient;
        
        const selectedPatientDiv = document.getElementById('selected-patient');
        selectedPatientDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div>
                    <strong>${Utils.escapeHtml(patient.name)}</strong><br>
                    <small>CPF: ${Utils.formatCpf(patient.cpf)} | ID: ${patient.id}</small>
                </div>
                <button class="btn btn-secondary" onclick="app.clearSelectedPatient()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        this.updateScheduleButton();
        this.showSection('schedule');
        toast.success('Paciente selecionado com sucesso');
    }

    clearSelectedPatient() {
        this.selectedPatient = null;
        
        const selectedPatientDiv = document.getElementById('selected-patient');
        selectedPatientDiv.innerHTML = 'Nenhum paciente selecionado';
        
        this.updateScheduleButton();
    }

    showPatientModal(patient) {
        const modal = document.getElementById('patient-modal');
        const detailsDiv = document.getElementById('patient-details');
        
        detailsDiv.innerHTML = `
            <div class="patient-info">
                <div class="info-item">
                    <span class="info-label">ID</span>
                    <span class="info-value">${patient.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Nome</span>
                    <span class="info-value">${Utils.escapeHtml(patient.name)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">CPF</span>
                    <span class="info-value">${Utils.formatCpf(patient.cpf)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Data de Nascimento</span>
                    <span class="info-value">${Utils.formatDate(patient.dateOfBirth)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Idade</span>
                    <span class="info-value">${Utils.calculateAge(patient.dateOfBirth)} anos</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Telefone</span>
                    <span class="info-value">${Utils.formatPhone(patient.phoneNumber)}</span>
                </div>
            </div>
        `;
        
        // Store patient data for selection
        modal.dataset.patientId = patient.id;
        modal.classList.add('show');
    }

    hideModal() {
        const modal = document.getElementById('patient-modal');
        modal.classList.remove('show');
    }

    selectPatientFromModal() {
        const modal = document.getElementById('patient-modal');
        const patientId = parseInt(modal.dataset.patientId);
        
        // Find patient in current search results
        const searchResults = document.getElementById('search-results');
        const patientCards = searchResults.querySelectorAll('.patient-card');
        
        for (let card of patientCards) {
            if (parseInt(card.dataset.patientId) === patientId) {
                const selectBtn = card.querySelector('.btn-select-patient');
                selectBtn.click();
                break;
            }
        }
        
        this.hideModal();
    }

    clearScheduleForm() {
        this.clearSelectedPatient();
        
        document.getElementById('doctor-select').value = '';
        document.getElementById('specialty-filter').value = '';
        document.getElementById('appointment-date').value = '';
        document.getElementById('appointment-time').value = '';
        
        this.filterDoctorsBySpecialty();
        this.updateScheduleButton();
    }

    async scheduleAppointment() {
        const doctorSelect = document.getElementById('doctor-select');
        const dateInput = document.getElementById('appointment-date');
        const timeSelect = document.getElementById('appointment-time');
        
        if (!this.selectedPatient || !doctorSelect.value || !dateInput.value || !timeSelect.value) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }
        
        try {
            loading.show();
            
            const appointment = await api.scheduleAppointment(
                this.selectedPatient.id,
                doctorSelect.value,
                dateInput.value,
                timeSelect.value
            );
            
            toast.success('Consulta agendada com sucesso!');
            this.clearScheduleForm();
            
            // Update time slots to reflect the new appointment
            this.updateTimeSlots();
            
        } catch (error) {
            console.error('Erro ao agendar consulta:', error);
            toast.error('Erro ao agendar consulta. Verifique se o horário ainda está disponível.');
        } finally {
            loading.hide();
        }
    }

    async loadAppointments() {
        try {
            loading.show();
            this.appointments = await api.getAllAppointments();
            this.displayAppointments(this.appointments);
        } catch (error) {
            console.error('Erro ao carregar consultas:', error);
            toast.error('Erro ao carregar consultas');
        } finally {
            loading.hide();
        }
    }

    async filterAppointments() {
        const filterDate = document.getElementById('filter-date');
        const filterStatus = document.getElementById('filter-status');
        
        let filteredAppointments = [...this.appointments];
        
        if (filterDate.value) {
            filteredAppointments = filteredAppointments.filter(apt => 
                apt.appointmentDate === filterDate.value
            );
        }
        
        if (filterStatus.value) {
            filteredAppointments = filteredAppointments.filter(apt => 
                apt.status === filterStatus.value
            );
        }
        
        this.displayAppointments(filteredAppointments);
    }

    displayAppointments(appointments) {
        const container = document.getElementById('appointments-list');
        
        if (!appointments || appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Nenhuma consulta encontrada</h3>
                    <p>Não há consultas para os filtros selecionados</p>
                </div>
            `;
            return;
        }
        
        // Sort appointments by date and time
        appointments.sort((a, b) => {
            const dateCompare = Utils.compareDates(a.appointmentDate, b.appointmentDate);
            if (dateCompare !== 0) return dateCompare;
            return a.appointmentTime.localeCompare(b.appointmentTime);
        });
        
        container.innerHTML = appointments.map(appointment => `
            <div class="appointment-card">
                <div class="appointment-info">
                    <div class="info-item">
                        <span class="info-label">Paciente</span>
                        <span class="info-value">${Utils.escapeHtml(appointment.patient.name)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Médico</span>
                        <span class="info-value">${Utils.escapeHtml(appointment.doctor.name)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Especialidade</span>
                        <span class="info-value">${Utils.escapeHtml(appointment.doctor.specialty)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Data e Horário</span>
                        <span class="info-value">${Utils.formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">
                            <span class="status-badge ${Utils.getStatusClass(appointment.status)}">
                                ${Utils.translateStatus(appointment.status)}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="card-actions">
                    ${this.getAppointmentActions(appointment)}
                </div>
            </div>
        `).join('');
        
        // Add event listeners for status updates
        container.querySelectorAll('.btn-update-status').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appointmentId = parseInt(e.target.dataset.appointmentId);
                const newStatus = e.target.dataset.status;
                this.updateAppointmentStatus(appointmentId, newStatus);
            });
        });
    }

    getAppointmentActions(appointment) {
        const actions = [];
        
        if (appointment.status === 'scheduled') {
            actions.push(`
                <button class="btn btn-success btn-update-status" data-appointment-id="${appointment.id}" data-status="confirmed">
                    <i class="fas fa-check"></i>
                    Confirmar
                </button>
            `);
            actions.push(`
                <button class="btn btn-danger btn-update-status" data-appointment-id="${appointment.id}" data-status="cancelled">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
            `);
        }
        
        if (appointment.status === 'confirmed') {
            actions.push(`
                <button class="btn btn-success btn-update-status" data-appointment-id="${appointment.id}" data-status="completed">
                    <i class="fas fa-check-circle"></i>
                    Finalizar
                </button>
            `);
            actions.push(`
                <button class="btn btn-warning btn-update-status" data-appointment-id="${appointment.id}" data-status="no_show">
                    <i class="fas fa-user-times"></i>
                    Não Compareceu
                </button>
            `);
        }
        
        return actions.join('');
    }

    async updateAppointmentStatus(appointmentId, newStatus) {
        try {
            loading.show();
            
            await api.updateAppointmentStatus(appointmentId, newStatus);
            
            // Update local data
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = newStatus;
            }
            
            toast.success('Status da consulta atualizado com sucesso');
            this.filterAppointments(); // Refresh display
            
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Erro ao atualizar status da consulta');
        } finally {
            loading.hide();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

