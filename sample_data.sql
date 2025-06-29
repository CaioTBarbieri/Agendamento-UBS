-- Dados de exemplo para o sistema de agendamento UBS

-- Inserir pacientes de exemplo
INSERT INTO patients (name, cpf, date_of_birth, phone_number) VALUES
('João Silva Santos', '123.456.789-01', '1985-03-15', '(11) 98765-4321'),
('Maria Oliveira Costa', '234.567.890-12', '1990-07-22', '(11) 97654-3210'),
('Pedro Souza Lima', '345.678.901-23', '1978-11-08', '(11) 96543-2109'),
('Ana Paula Ferreira', '456.789.012-34', '1995-01-30', '(11) 95432-1098'),
('Carlos Eduardo Rocha', '567.890.123-45', '1982-09-14', '(11) 94321-0987'),
('Fernanda Alves Pereira', '678.901.234-56', '1988-05-03', '(11) 93210-9876'),
('Roberto Carlos Silva', '789.012.345-67', '1975-12-25', '(11) 92109-8765'),
('Juliana Santos Oliveira', '890.123.456-78', '1992-04-18', '(11) 91098-7654'),
('Marcos Antonio Lima', '901.234.567-89', '1980-08-07', '(11) 90987-6543'),
('Luciana Fernandes Costa', '012.345.678-90', '1987-10-12', '(11) 89876-5432');

-- Inserir médicos de exemplo
INSERT INTO doctors (name, specialty) VALUES
('Dr. João Carlos Mendes', 'Clínica Geral'),
('Dra. Maria Fernanda Silva', 'Pediatria'),
('Dr. Pedro Henrique Costa', 'Cardiologia'),
('Dra. Ana Beatriz Santos', 'Ginecologia'),
('Dr. Carlos Roberto Lima', 'Ortopedia'),
('Dra. Fernanda Cristina Alves', 'Dermatologia'),
('Dr. Roberto Silva Pereira', 'Neurologia'),
('Dra. Juliana Oliveira Rocha', 'Psiquiatria'),
('Dr. Marcos Paulo Ferreira', 'Urologia'),
('Dra. Luciana Santos Costa', 'Endocrinologia');

-- Inserir alguns agendamentos de exemplo
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES
(1, 1, '2025-07-01', '08:00:00', 'scheduled'),
(2, 2, '2025-07-01', '09:00:00', 'scheduled'),
(3, 3, '2025-07-01', '10:00:00', 'confirmed'),
(4, 4, '2025-07-02', '08:30:00', 'scheduled'),
(5, 5, '2025-07-02', '09:30:00', 'scheduled'),
(6, 6, '2025-07-02', '10:30:00', 'scheduled'),
(7, 7, '2025-07-03', '08:00:00', 'scheduled'),
(8, 8, '2025-07-03', '09:00:00', 'scheduled'),
(9, 9, '2025-07-03', '10:00:00', 'scheduled'),
(10, 10, '2025-07-04', '08:30:00', 'scheduled');

