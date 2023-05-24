# ASE Platform

This was a submission for my Web Developement Course at HTW-Berlin. Now I have refactored a lot of things and 
it became a more stable Version of the application.

Demo of the first version here: https://youtu.be/qA3yRjShuEQ


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

### TODO List:

- ase logo
- sort by modification date
- restart, fullscreen and fps display

#### Bugs:

- code window scrollable for mobile
- line number in buffer errors
- inlay hint 4times or more on tab change -> remove hints and put them into suggestions popup
- adjust css and remove ng-deep -> @HostBinding() class = 'example-button'
- replace loading buttons with component and re-enable button on request finish
- fix expired token error

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
