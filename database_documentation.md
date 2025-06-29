# Documentação do Banco de Dados - Sistema de Agendamento UBS

## Visão Geral

O banco de dados foi modelado para suportar um sistema de agendamento de consultas médicas para Unidades Básicas de Saúde (UBS). O sistema permite o agendamento de pacientes através do ID ou nome do paciente.

## Estrutura do Banco de Dados

### Tabela: patients (Pacientes)

Armazena informações dos pacientes cadastrados no sistema.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INT | Identificador único do paciente | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | Nome completo do paciente | NOT NULL |
| cpf | VARCHAR(14) | CPF do paciente | UNIQUE, NOT NULL |
| date_of_birth | DATE | Data de nascimento | - |
| phone_number | VARCHAR(20) | Número de telefone | - |

### Tabela: doctors (Médicos)

Armazena informações dos médicos disponíveis para consultas.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INT | Identificador único do médico | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | Nome completo do médico | NOT NULL |
| specialty | VARCHAR(255) | Especialidade médica | NOT NULL |

### Tabela: appointments (Agendamentos)

Armazena os agendamentos de consultas entre pacientes e médicos.

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INT | Identificador único do agendamento | PRIMARY KEY, AUTO_INCREMENT |
| patient_id | INT | ID do paciente | NOT NULL, FOREIGN KEY |
| doctor_id | INT | ID do médico | NOT NULL, FOREIGN KEY |
| appointment_date | DATE | Data da consulta | NOT NULL |
| appointment_time | TIME | Horário da consulta | NOT NULL |
| status | VARCHAR(50) | Status do agendamento | DEFAULT 'scheduled' |

## Relacionamentos

- **patients** 1:N **appointments** - Um paciente pode ter múltiplos agendamentos
- **doctors** 1:N **appointments** - Um médico pode ter múltiplos agendamentos

## Status de Agendamento

Os possíveis valores para o campo `status` na tabela `appointments`:

- `scheduled` - Agendado (padrão)
- `confirmed` - Confirmado
- `completed` - Realizado
- `cancelled` - Cancelado
- `no_show` - Paciente não compareceu

## Funcionalidades Suportadas

1. **Busca de Pacientes**: Por ID ou nome
2. **Agendamento de Consultas**: Associação entre paciente e médico
3. **Gestão de Médicos**: Cadastro e consulta de médicos por especialidade
4. **Controle de Status**: Acompanhamento do status dos agendamentos

## Índices Recomendados

Para otimizar as consultas mais frequentes:

```sql
CREATE INDEX idx_patient_name ON patients(name);
CREATE INDEX idx_patient_cpf ON patients(cpf);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointment_patient ON appointments(patient_id);
CREATE INDEX idx_appointment_doctor ON appointments(doctor_id);
```

## Dados de Exemplo

O sistema será inicializado com dados de exemplo para facilitar os testes e demonstrações.

