FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY pom.xml ./
RUN mvn --batch-mode dependency:go-offline

COPY src ./src
RUN mvn --batch-mode -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

RUN groupadd --system library && useradd --system --gid library library

COPY --from=build /workspace/target/*.jar /app/library-api.jar

USER library

EXPOSE 10000

ENTRYPOINT ["java", "-jar", "/app/library-api.jar"]
