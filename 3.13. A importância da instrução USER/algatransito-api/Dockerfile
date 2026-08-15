##STAGE BUILD
FROM gradle:jdk21 as build
WORKDIR /app
COPY . .
RUN gradle clean bootJar

## STAGE RUN
FROM eclipse-temurin:21-jre-jammy

ARG ENV

ENV JAR_NAME=algatransito-api.jar \
    SERVER_PORT=8081 \
    SPRING_PROFILES_ACTIVE=$ENV

    RUN groupadd -r spring && useradd -r -g spring spring

WORKDIR /app

COPY --from=build /app/build/libs/$JAR_NAME .

USER spring

EXPOSE $SERVER_PORT

ENTRYPOINT java -jar $JAR_NAME