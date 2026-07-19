FROM node:22-alpine AS frontend-build

WORKDIR /workspace/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
ENV VITE_API_BASE_URL=/api
RUN npm run build \
    && find dist/assets -type f \( -name '*.js' -o -name '*.css' \) -exec gzip -9 -k {} \;

FROM maven:3.9.9-eclipse-temurin-17 AS backend-build

WORKDIR /workspace/backend

COPY backend/pom.xml ./
RUN mvn --batch-mode dependency:go-offline

COPY backend/src ./src
COPY --from=frontend-build /workspace/frontend/dist ./src/main/resources/static
RUN mvn --batch-mode -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

RUN groupadd --system library && useradd --system --gid library library

COPY --from=backend-build /workspace/backend/target/*.jar /app/jamhuuriyo-library.jar

ENV JAVA_TOOL_OPTIONS="-Xms24m -Xmx96m -XX:MaxMetaspaceSize=88m -XX:ReservedCodeCacheSize=24m -XX:+UseSerialGC -Xss256k"

USER library

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/jamhuuriyo-library.jar"]
