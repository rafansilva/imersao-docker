#!/bin/sh
# docker-entrypoint.sh

set -e

# Função para verificar a disponibilidade do SQL Server
check_mssql() {
  echo "Verificando conexão com SQL Server em ${DB_HOST:-localhost}:1433..."

  max_attempts=10
  attempt=0

  while [ $attempt -lt $max_attempts ]; do
    if nc -z "${DB_HOST:-localhost}" 1433 2>/dev/null; then
      echo "SQL Server está disponível!"
      return 0
    fi

    attempt=$((attempt+1))
    echo "Tentativa $attempt/$max_attempts, aguardando SQL Server (${DB_HOST:-localhost})..."
    sleep 2
  done

  echo "Não foi possível conectar ao SQL Server após $max_attempts tentativas"
  return 1
}

# Configurações de JVM padrão
if [ -z "$JAVA_OPTS" ]; then
  JAVA_OPTS="-XX:MaxRAMPercentage=70.0 -Djava.security.egd=file:/dev/./urandom"
fi

# Se o primeiro argumento for "check-db",
# apenas verificar banco de dados
if [ "$1" = "check-db" ]; then
  check_mssql
  exit $?
fi

# Para o comportamento padrão, verificar banco de dados
# antes de iniciar a aplicação
if [ "$SKIP_DB_CHECK" != "true" ] && [ "$SPRING_PROFILES_ACTIVE" = "prod" ]; then
  check_mssql
fi

# Iniciar aplicação com as variáveis e argumentos configurados
echo "Iniciando AlgaTransito API com perfil: ${SPRING_PROFILES_ACTIVE:-dev}"
echo "Porta configurada: ${SERVER_PORT:-9090}"
echo "Opções JVM: ${JAVA_OPTS}"

# Executar aplicação
exec java $JAVA_OPTS -jar ${JAR_NAME:-app.jar} "$@"

