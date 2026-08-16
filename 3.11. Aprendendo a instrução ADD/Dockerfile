FROM openjdk:21-ea-jdk-slim

WORKDIR /app

ADD wildfly-41.0.0.Final.tar.gz .

#RUN tar -xzf wildfly-41.0.0.Final.tar.gz && \
#    rm wildfly-41.0.0.Final.tar.gz && \
#    echo "WildFly extracted successfully"

EXPOSE 8080

CMD ["wildfly-41.0.0.Final/bin/standalone.sh", "-b", "0.0.0.0"]

