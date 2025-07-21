# ---- Stage 1: Build the app with Maven ----
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies first (leverage Docker cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Package the app
RUN mvn clean package -DskipTests

# ---- Stage 2: Run the app ----
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the packaged jar from the builder stage
COPY --from=builder /app/target/vibesbased-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
