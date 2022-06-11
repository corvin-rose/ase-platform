# ASE Platform

This is a submission for my Web Developement Course at HTW-Berlin.


### Project Setup
The following are basic instructions to setup the project properly, to get the application running as intended.

#### 1. Install Maven
Download Maven from https://maven.apache.org/download.cgi and copy it to a desired path. (e.g. C:/apache-maven-3.8.5)
<br>
Now add Maven to your environment variables. In Path add a new entry `C:/apache-maven-3.8.5/bin` (replace with your Maven path).

#### 2. Install Docker
Download Docker Desktop from https://www.docker.com/products/docker-desktop/ and install it.<br>
Inside `/ase-platform/env/docker` run `docker-compose up -d --build` to build and run postgres.

#### 3. Install NodeJs
Download and install NodeJs from https://nodejs.org/en/download/. Try `npm -v` to check your installation.
Inside `/ase-platform/ase-frontend` run `npm install` to install needed packages.

#### 4. Build Project
To build all project files run `mvn clean install -DskipTests` inside `/aseplatform`. You can skip all Unit Tests, because in this case you only want to build everything.

#### 5. Run application
For the backend run: `mvn spring-boot:run` inside `/ase-platform/ase-backend`
For the frontend run `ng serve` inside `/ase-platform/ase-frontend`