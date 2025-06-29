# Sistema de Agendamento UBS

Sistema completo para agendamento de consultas médicas em Unidades Básicas de Saúde (UBS), desenvolvido com backend em Java Spring Boot e frontend em HTML5, CSS3 e JavaScript.

## Funcionalidades

- **Busca de Pacientes**: Busca por ID ou nome do paciente
- **Agendamento de Consultas**: Interface intuitiva para agendar consultas
- **Gestão de Médicos**: Filtros por especialidade
- **Controle de Status**: Acompanhamento do status das consultas
- **Interface Responsiva**: Compatível com desktop e mobile

## Tecnologias Utilizadas

### Backend
- Java 11
- Spring Boot 2.7.0
- Spring Data JPA
- MySQL 8.0
- Maven

### Frontend
- HTML5
- CSS3
- JavaScript ES6+
- Font Awesome
- Google Fonts

### Banco de Dados
- MySQL 8.0

## Estrutura do Projeto

```
├── ubs-agendamento-backend/          # Backend Java Spring Boot
│   ├── src/main/java/com/ubs/agendamento/
│   │   ├── controller/               # Controladores REST
│   │   ├── model/                    # Entidades JPA
│   │   ├── repository/               # Repositórios
│   │   ├── service/                  # Serviços
│   │   ├── config/                   # Configurações
│   │   └── AgendamentoApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── ubs-agendamento-frontend/         # Frontend
│   └── src/
│       ├── index.html
│       ├── css/style.css
│       └── js/
│           ├── api.js
│           ├── utils.js
│           └── app.js
├── database_schema.sql               # Esquema do banco
├── sample_data.sql                   # Dados de exemplo
└── database_documentation.md         # Documentação do BD
```

## Pré-requisitos

- Java JDK 11 ou superior
- Maven 3.6 ou superior
- MySQL 8.0 ou superior
- Navegador web moderno

## Instalação e Configuração

### 1. Configuração do Banco de Dados

1. Instale e configure o MySQL
2. Crie o banco de dados:
```sql
CREATE DATABASE ubs_agendamento;
```

3. Execute o script de criação das tabelas:
```bash
mysql -u root -p ubs_agendamento < database_schema.sql
```

4. (Opcional) Insira dados de exemplo:
```bash
mysql -u root -p ubs_agendamento < sample_data.sql
```

### 2. Configuração do Backend

1. Navegue para o diretório do backend:
```bash
cd ubs-agendamento-backend
```

2. Configure as credenciais do banco no arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

3. Compile o projeto:
```bash
mvn clean compile
```

4. Execute a aplicação:
```bash
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 3. Configuração do Frontend

1. Navegue para o diretório do frontend:
```bash
cd ubs-agendamento-frontend/src
```

2. Abra o arquivo `index.html` em um navegador web ou use um servidor local:
```bash
# Usando Python (se disponível)
python -m http.server 3000

# Ou usando Node.js (se disponível)
npx serve .
```

O frontend estará disponível em: `http://localhost:3000`

## APIs Disponíveis

### Pacientes
- `GET /api/patients` - Listar todos os pacientes
- `GET /api/patients/{id}` - Buscar paciente por ID
- `GET /api/patients/search?term={termo}` - Buscar pacientes por ID ou nome
- `GET /api/patients/cpf/{cpf}` - Buscar paciente por CPF
- `POST /api/patients` - Criar novo paciente
- `PUT /api/patients/{id}` - Atualizar paciente
- `DELETE /api/patients/{id}` - Excluir paciente

### Médicos
- `GET /api/doctors` - Listar todos os médicos
- `GET /api/doctors/{id}` - Buscar médico por ID
- `GET /api/doctors/specialty/{specialty}` - Buscar médicos por especialidade
- `GET /api/doctors/search?name={nome}` - Buscar médicos por nome
- `GET /api/doctors/specialties` - Listar todas as especialidades
- `POST /api/doctors` - Criar novo médico
- `PUT /api/doctors/{id}` - Atualizar médico
- `DELETE /api/doctors/{id}` - Excluir médico

### Agendamentos
- `GET /api/appointments` - Listar todos os agendamentos
- `GET /api/appointments/{id}` - Buscar agendamento por ID
- `GET /api/appointments/patient/{patientId}` - Agendamentos por paciente
- `GET /api/appointments/doctor/{doctorId}` - Agendamentos por médico
- `GET /api/appointments/date/{date}` - Agendamentos por data
- `GET /api/appointments/doctor/{doctorId}/date/{date}` - Agendamentos por médico e data
- `GET /api/appointments/check-availability` - Verificar disponibilidade
- `POST /api/appointments/schedule` - Agendar consulta
- `PUT /api/appointments/{id}/status` - Atualizar status
- `DELETE /api/appointments/{id}` - Cancelar agendamento

## Como Usar

### 1. Buscar Paciente
1. Na aba "Buscar Paciente", digite o ID ou nome do paciente
2. Clique em "Buscar" ou pressione Enter
3. Selecione o paciente desejado nos resultados

### 2. Agendar Consulta
1. Com um paciente selecionado, vá para a aba "Agendar Consulta"
2. Selecione o médico (opcionalmente filtre por especialidade)
3. Escolha a data e horário disponível
4. Clique em "Agendar Consulta"

### 3. Gerenciar Consultas
1. Na aba "Consultas", visualize todas as consultas agendadas
2. Use os filtros por data e status
3. Atualize o status das consultas conforme necessário

## Status de Agendamento

- **Agendado**: Consulta marcada
- **Confirmado**: Consulta confirmada pelo paciente
- **Realizado**: Consulta finalizada
- **Cancelado**: Consulta cancelada
- **Não Compareceu**: Paciente não compareceu

## Dados de Exemplo

O sistema inclui dados de exemplo para facilitar os testes:

### Pacientes
- João Silva Santos (ID: 1, CPF: 123.456.789-01)
- Maria Oliveira Costa (ID: 2, CPF: 234.567.890-12)
- Pedro Souza Lima (ID: 3, CPF: 345.678.901-23)

### Médicos
- Dr. João Carlos Mendes (Clínica Geral)
- Dra. Maria Fernanda Silva (Pediatria)
- Dr. Pedro Henrique Costa (Cardiologia)

## Solução de Problemas

### Backend não inicia
- Verifique se o MySQL está rodando
- Confirme as credenciais no `application.properties`
- Verifique se a porta 8080 está disponível

### Frontend não carrega dados
- Verifique se o backend está rodando
- Confirme a URL da API no arquivo `js/api.js`
- Verifique o console do navegador para erros

### Erro de CORS
- O backend está configurado para aceitar requisições de qualquer origem
- Se necessário, ajuste as configurações em `CorsConfig.java`

## Desenvolvimento

### Estrutura do Backend
- **Controllers**: Endpoints REST
- **Services**: Lógica de negócio
- **Repositories**: Acesso aos dados
- **Models**: Entidades JPA
- **Config**: Configurações (CORS, etc.)

### Estrutura do Frontend
- **index.html**: Estrutura da página
- **css/style.css**: Estilos e layout responsivo
- **js/api.js**: Comunicação com o backend
- **js/utils.js**: Utilitários e helpers
- **js/app.js**: Lógica principal da aplicação

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste thoroughly
5. Submeta um pull request

## Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs do backend
3. Verifique o console do navegador
4. Entre em contato com a equipe de desenvolvimento

