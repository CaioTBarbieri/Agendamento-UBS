#!/bin/bash

# Script para inicializar o Sistema de Agendamento UBS

echo "=== Sistema de Agendamento UBS ==="
echo "Iniciando o sistema..."

# Verificar se o Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado. Por favor, instale o Java JDK 11 ou superior."
    exit 1
fi

# Verificar se o Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven não encontrado. Por favor, instale o Maven 3.6 ou superior."
    exit 1
fi

# Verificar se o MySQL está rodando
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL não encontrado. Certifique-se de que o MySQL está instalado e rodando."
fi

echo "✅ Pré-requisitos verificados"

# Navegar para o diretório do backend
cd ubs-agendamento-backend

echo "📦 Compilando o backend..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "✅ Backend compilado com sucesso"
    
    echo "🚀 Iniciando o backend..."
    echo "O backend estará disponível em: http://localhost:8080"
    echo "Para parar o backend, pressione Ctrl+C"
    echo ""
    echo "Após o backend iniciar, abra o arquivo frontend/src/index.html em seu navegador"
    echo "ou execute um servidor local na pasta frontend/src/"
    echo ""
    
    # Iniciar o backend
    mvn spring-boot:run
else
    echo "❌ Erro ao compilar o backend"
    exit 1
fi

