# TSI Digital Hub
A ready-to-deploy, open-source digital hub solution for industry associations to drive digital transformation.

## Prerequisites

Before you begin, ensure you have the following software installed on your development machine or server:

* **Java Development Kit (JDK) 17 or higher**: Required to build and run the Java application.
    * **Installation Steps:**
        * **Linux (Ubuntu/Debian):**
            ```bash
            sudo apt update
            sudo apt install openjdk-17-jdk
            ```
        * **Windows:** Download the JDK 17 installer from Oracle (requires account) or Adoptium (Eclipse Temurin, recommended open-source distribution) and follow the installation wizard. Ensure `JAVA_HOME` environment variable is set and `%JAVA_HOME%\bin` is in your system's `Path`.
    * **Verification:**
        ```bash
        java -version
        javac -version
        ```

* **Apache Maven 3.6.0 or higher**: Project build automation tool.
    * **Installation Steps:**
        * **Linux (Ubuntu/Debian):**
            ```bash
            sudo apt install maven
            ```
        * **Windows:** Download the Maven binary zip from the Apache Maven website, extract it, and add the `bin` directory to your system's `Path` environment variable.
    * **Verification:**
        ```bash
        mvn -v
        ```

* **Docker Desktop (or Docker Engine + Docker Compose)**: Essential for containerizing and running the application and database locally.
    * **Installation Steps:**
        * **Windows:** Download and install Docker Desktop from the [official Docker website](https://www.docker.com/products/docker-desktop/).
        * **Linux:** Follow the official Docker Engine installation guide for your specific distribution (e.g., [Docker Docs](https://docs.docker.com/engine/install/)). Install Docker Compose separately if using Docker Engine.
    * **Configuration & Verification (Windows Specific):**
        * Ensure **WSL 2** is enabled and configured. Open PowerShell as Administrator and run `wsl --install` or `wsl --update`.
        * Verify **virtualization (Intel VT-x / AMD-V)** is enabled in your computer's BIOS/UEFI settings.
        * Start Docker Desktop and wait for the whale icon in the system tray to turn solid.
    * **Verification:**
        ```bash
        docker --version
        docker compose version # Or docker-compose --version for older installations
        ```

* **Git**: For cloning the repository.
    * **Installation Steps:**
        * **Linux (Ubuntu/Debian):**
            ```bash
            sudo apt install git
            ```
        * **Windows:** Download the Git for Windows installer from [git-scm.com](https://git-scm.com/download/win) and follow the installation wizard.
    * **Verification:**
        ```bash
        git --version
        ```

* **NodeJS**: The JavaScript runtime environment for frontend app.
    * **Installation Steps:**
      * Navigate to the Node.js [Downloads](https://nodejs.org/en/download) page. 
      * Select the installer for your operating system (Windows, macOS, or Linux). Choose the LTS (Long-Term Support) version, as it is the most stable and recommended for most users. 
      * Run the installer and follow the on-screen prompts. The installer will automatically set up both Node.js and npm.
 
## Installation Steps (Docker)

Follow these steps to get the TSI Digital Hub solution running on your local machine using Docker Compose:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/tsi-coop/tsi-digital-hub.git
    cd tsi-digital-hub
    ```

2.  **Create `.env` File:**
    This file stores sensitive configurations (passwords, API keys, etc.) and is **NOT** committed to Git.
    ```bash
    cp .example .env
    ```
    Now, **edit the newly created `.env` file** and fill in the placeholder values:
    * `POSTGRES_DB`,`POSTGRES_USER`,`DB_PASSWORD`: Database Configuration
    * `TSI_DIGITAL_HUB_ENV`, `REACT_APP_TSI_API_BASE_URL`,`NODE_ENV`: Basic application configuration
    * `ZOHO_API_HOST`,`ZOHO_AUTH_KEY`,`SENDER_EMAIL`,`SENDER_NAME`: Email configuration
    
3.  **Build modules**
    Build the backend app using
    ```bash
    build-backend.bat
    ```
    This will create `backend/target/tsi_digital_hub.war`.

    Build the frontend app using
    ```bash
    build-frontend.bat
    ```
    This will create output files in `frontend/build`.

4.  **Initialize PostgreSQL Database Schema:**
    The `postgres` Docker image only runs initialization scripts on its *first* startup when the data directory is empty. Modify the backend/db/init.sql insert queries at the end to use your organisation domain and email id as ADMIN user instead of admin@tsicoop.org. To ensure your schema is loaded:
    ```bash
    docker-compose down -v 
    ```

5.  **Build and Start Docker Services:**
    This command will build your application's Docker image and start both the PostgreSQL database and the Jetty application.
    ```bash
    docker-compose up --build -d
    ```
    * `--build`: Ensures Docker images are rebuilt, picking up any changes in your Java code or Dockerfile.
    * `-d`: Runs the containers in detached mode (in the background).

6.  **Verify Services and Check Logs:**
    * Check if containers are running: `docker ps`
    * Monitor PostgreSQL logs for schema initialization: `docker-compose logs -f postgres_db`
    * Monitor application logs for successful deployment: `docker-compose logs -f appserver`
    * Monitor frontend logs for successful deployment: `docker-compose logs -f appserver`
    * Check the application: `http://localhost:3000`
    * Sign in with user admin email configured in the init.sql, complete the captcha and use `1234` as Email OTP for the local setup. 

## Installation Steps (without Docker)

These steps describe how to install and run the TSI Aadhaar Vault Plus solution directly on a Linux/Windows server without using Docker.

1.   **Clone the Repository:**
     ```bash
     git clone https://github.com/tsi-coop/tsi-digital-hub.git
     cd tsi-digital-hub
     ```

2.  **PostgreSQL Database Setup:**
    * Log in as the PostgreSQL superuser (e.g., `postgres` user on Linux).
    ```bash
    sudo -i -u postgres psql
    ```
    * Create the database and user:
    ```sql
    CREATE DATABASE <<your-db-name-here>>;
    CREATE USER <<your-db-user-here>> WITH ENCRYPTED PASSWORD '<<your_db_password_here>>';
    GRANT ALL PRIVILEGES ON DATABASE <<your-db-name-here>> TO <<your-db-user-here>>;
    ```
    * Exit the postgres user: `exit`
    * **Initialize Schema:** Execute the `db/init.sql` script to create the necessary tables. Modify the COPY commands towards to the end to load the master data from your file system instead of the docker file system. Comment out the copy commands that operates inside docker and uncomment the copy commands that directly loads from the file system.
    ```bash
    psql -U <<your-db-user-here>> -d <<your-db-name-here>> -h localhost -f /path/to/tsi-digital-hub/backend/db/init.sql
    ```

3.  **Build Backend Module:**
    ```bash
    cd /path/to/tsi-digital-hub/backend
    mvn clean package
    ```
    This will generate `target/tsi_digital_hub.war`.

4.  **Deploy Backend Module (linux):**
    ```bash
    cd /path/to/tsi-digital-hub/backend/server
    cp .example .env
    ```
    Now, **edit the newly created `.env` file** and fill in the placeholder values.

    ```bash
    ./set-base.sh #Sets the jetty base directory
    ./serve.sh # Copies the target/tsi_digital_hub.war to %JETTY_BASE%/webapps/ROOT.wat. Starts the server in 8080
    ```
5. **Deploy Backend Module (windows):**
   ```bash
   cd /path/to/tsi-digital-hub/backend/server
   copy .example .env
   ```
   Now, **edit the newly created `.env` file** and fill in the placeholder values.

   ```bash
   set-base.bat #Sets the jetty base directory
   serve.bat # Copies the target/tsi_digital_hub.war to %JETTY_BASE%/webapps/ROOT.wat. Starts the server in 8080
   ```
6. **Deploy Frontend Module (windows):**
   ```bash
   cd /path/to/tsi-digital-hub/frontend
   copy .example .env
   ```
   Now, **edit the newly created `.env` file** and fill in the placeholder values.

   ```bash
   npm run build #Outputs to /path/to/tsi-digital-hub/frontend/build directory
   ```
    
   Copy the build output to nginx.conf /var/www/html folder.
   Modify the nginx.conf to reverse proxy all /api/* requests to http://localhost:8080
7. **Verify Services and Check Logs:**
    * Check the application: `http://localhost` // Assuming nginx runs on port 80
    * Sign in with user admin email configured in the init.sql, complete the captcha and use `1234` as Email OTP for the local setup.

## User Guide

Coming Soon

## Support

To submit your request, sign up at [TSI Community](https://tsicoop.org) and visit the Engage > Support section.

