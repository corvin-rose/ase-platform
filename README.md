# ASE Platform

This was a submission for my Web Developement Course at HTW-Berlin. Now I have refactored a lot of things and 
it became a more stable Version of the application.

Demo here: https://youtu.be/qA3yRjShuEQ


### Project Setup
The following are basic instructions to setup the project properly, to get the application running as intended.

#### 1. Install Docker
Download Docker Desktop from https://www.docker.com/products/docker-desktop/ and install it.<br>
Run `docker-compose up -d --build` to build and run php and mysql.

#### 2. Install NodeJs
Download and install NodeJs from https://nodejs.org/en/download/. Try `npm -v` to check your installation.
Inside `/ase-platform/frontend` run `npm install` to install needed packages.

#### 3. Run application
Run `ng serve` inside `/ase-platform/frontend`<br>
(make sure you have angular CLI installed > `npm install -g @angular/cli`)


<br><br>

### General Information
1. This application still lacks some security measures regarding the users data and their authentication
2. This application runs with WebGL, therefore some devices may not be able to display the application properly. I have tried to cover all devices as good as possible

#### Implemented Features
* User
  * Login (POST)
  * Register (POST)
  * Profile (GET)
  * Settings (PUT)
* Shader
  * Create (POST)
  * Edit (PUT)
  * Render
  * Delete (DELETE)
  * Settings (PUT)
* Like Shaders (GET, POST)
* Search

<br><br>

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
