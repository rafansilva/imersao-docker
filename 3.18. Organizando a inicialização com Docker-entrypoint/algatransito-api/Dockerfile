##STAGE BUILD
FROM gradle:jdk21 as build
WORKDIR /app
COPY . .
RUN gradle clean bootJar

## STAGE RUN
FROM eclipse-temurin:21-jre-jammy

ARG ENV=dev

ENV JAR_NAME=algatransito-api.jar \
    SERVER_PORT=8081 \
    SPRING_PROFILES_ACTIVE=$ENV

RUN groupadd -r spring && useradd -r -g spring spring && \
    apt update && \
    apt install -y netcat-openbsd

WORKDIR /app

COPY --from=build /app/build/libs/$JAR_NAME .
COPY --chown=spring:spring docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

USER spring

HEALTHCHECK --interval=5s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:$SERVER_PORT/actuator/health || exit 1

EXPOSE $SERVER_PORT

ENTRYPOINT ["./docker-entrypoint.sh"]