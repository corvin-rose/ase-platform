# ASE Platform

This is a submission for my Web Developement Course at HTW-Berlin.


### Project Setup
The following are basic instructions to setup the project properly, to get the application running as intended.
Make sure to use Java JDK 17 (check with `mvn -v`), otherwise the project won't compile!

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
To build all project files run `mvn clean install -DskipTests` inside `/ase-platform`. You can skip all Unit Tests, because in this case you only want to build everything.

#### 5. Run application
For the backend run: `mvn spring-boot:run` inside `/ase-platform/ase-backend`<br>
For the frontend run `ng serve` inside `/ase-platform/ase-frontend`<br>
(make sure you have angular CLI installed > `npm install -g @angular/cli`)


### General Information
1. This application still lacks some security measures regarding the users data and their authentication
2. This application runs with WebGL, therefore some devices may not be able to display the application properly. I have tried to cover all devices as good as possible

#### Implemented Features
* User
  * Login (POST)
  * Register (POST)
  * Profile (GET)
* Shader
  * Create (POST)
  * Edit (PUT)
  * Render
  * Delete (DELETE)
  * Settings (PUT)
* Like Shaders (GET, POST)
* Search


### Small guide on shaders
```
void main() {
	vec2 uv = gl_FragCoord.xy / RESOLUTION;     // Calculate pixel coordinates
	vec3 color = vec3(0.0);                     // Set color to black
	gl_FragColor = vec4(color, 1.0);            // Write color to buffer
}
```
Try out to manipulate the color of the shader:
```
// Blue color
vec3 color = vec3(0.12, 0.56, 1.0);       // Equal to RGB colors (range 0-1)
```
```
// Color in relation to the pixel coordinates
vec3 color = vec3(uv.xyy);
```
```
// Color in relation to sin curve
vec3 color = vec3(sin(TIME + uv.x));
```
