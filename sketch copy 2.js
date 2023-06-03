var canvas; 
let zoom_offset = 1; 

let width = window.innerWidth 
let height = window.innerHeight
let global_x_offset = 0; 
let global_y_offset = 0; 

let widthZoomAdjust = (width/2) - (width/2 * zoom_offset)
let heightZoomAdjust = (height/2) - (height/2 * zoom_offset)

let smoothFollowMode = true

let sun_mass = 20000
let mercury_mass = 10/318
let venus_mass = 20/318
let earth_mass = 20/318
let mars_mass = 12/318
let jupiter_mass = 20
let saturn_mass = 10
let uranus_mass = 7
let neptune_mass = 6


//planet colors
planet_colors = {
  'sun': [255, 255, 0],    
  'earth': [0, 0, 255],    
  'mars': [255, 0, 0],     
  'mercury': [200, 200, 200], 
  'jupiter': [150, 100, 50], 
  'saturn': [255, 165, 0],  
  'comet': [128, 128, 128], 
}

//classes
class Body{ 
  constructor(name, mass, speed, direction, radius, x, y, color){ 
      this.mass = mass;
      this.speed = speed; 
      this.direction = direction; 
      this.radius = radius; 
      this.x =
      this.y = y
      this.color = color 
      this.name = name

  }

  draw(x_offset, y_offset){ 
    fill(this.color)
    ellipse((this.x*zoom_offset + x_offset + widthZoomAdjust), (this.y*zoom_offset + y_offset + heightZoomAdjust), this.radius * zoom_offset)
  }

}


// Define the scaling factor
const scalingFactor = 1; // Adjust this value as needed

// Set the radii based on scaling factor and actual planet sizes
//name, mass, speed, direction, radius, x, y, color
let sun = new Body('sun', sun_mass, 5, Math.PI/2, 20 * scalingFactor, 0, 0, [255, 255, 0]);
let mercury = new Body('mercury', mercury_mass, 2, Math.PI/2, 4 * scalingFactor, -50, 100, [139, 69, 19]);
let venus = new Body('venus', venus_mass, 2, Math.PI/2, 6 * scalingFactor, 20, 20, [255, 165, 0]);
let earth = new Body('earth', earth_mass, 2, Math.PI/2, 6.4 * scalingFactor, -100, -100, [0, 0, 255]);
let mars = new Body('mars', mars_mass, 2, Math.PI/2.2, 3.4 * scalingFactor, 40, 40, [255, 0, 0]);
let jupiter = new Body('jupiter', jupiter_mass, 2, Math.PI/2, 15 * scalingFactor, 30, 30, [150, 100, 50]);
let saturn = new Body('saturn', saturn_mass, 2, Math.PI/2.3, 14 * scalingFactor, -120, 120, [210, 180, 140]);
let uranus = new Body('uranus', uranus_mass, 2, Math.PI/2, 13 * scalingFactor, 140, 140, [0, 206, 209]);
let neptune = new Body('neptune', neptune_mass, 2, Math.PI/2, 12 * scalingFactor, 500, 500, [30, 144, 255]);


let planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

let objects = []
planets.forEach((planet) => {
  planet.x += width/2
  planet.y += height/2
  objects.push(planet)
})
//physics functions 
function calculateSpeed(body1, body2) {
  G = 1
  let distance_x = (body1.x) - (body2.x);
  let distance_y = (body1.y) - (body2.y);
  let distance_squared = distance_x ** 2 + distance_y ** 2;

  if (distance_squared === 0) {
    return;
  }

  let distance = Math.sqrt(distance_squared);

  let force = (-G * body1.mass * body2.mass) / distance_squared; // Include negative sign for attraction

  let acceleration_x = (force * (distance_x / distance)) / body2.mass;
  let acceleration_y = (force * (distance_y / distance)) / body2.mass;

  let tangential_velocity = Math.sqrt(G * body1.mass / distance);
  let tangential_direction = Math.atan2(distance_y, distance_x) + body2.direction;

  body2.speed_x = tangential_velocity * Math.cos(tangential_direction);
  body2.speed_y = tangential_velocity * Math.sin(tangential_direction);
  
  const dt = 1; // Time step (adjust as needed)
  body2.x += body2.speed_x * dt;
  body2.y += body2.speed_y * dt;
}
//render objects
function renderObjects(objects, x_offset, y_offset){ 

  for(let i = 0; i < objects.length; i++){ 
    
    objects[i].draw(x_offset, y_offset)
    for(let j = 0; j < objects.length; j++){ 
      if(objects[i] !== objects[j]){ 
        calculateSpeed(objects[i], objects[j])
      }
    }
  }
}
//generateAstroids
function generateAstroids(count, spacing, init_coords){ 
  let x_increment = 0
  for(let i = 0; i < count; i++){ 
    x_increment += spacing
    //mass, speed, direction, radius, x, y, color
    objects.push(new Body('astroid',3, 200, Math.PI/2, 2, init_coords[0], init_coords[1] + x_increment, [255,255,255]))
  }
}

//html 
let astroid_count = 0; 
let astroid_count_tag = document.getElementById('astroid_count')
let astroid_count_button = document.getElementById('astroid_count_enter')

let showModal = document.getElementById('open_planet_settings')
let hideModal = document.getElementById('close_planet_settings')

let planetsMassDiv = document.getElementById('planet_mass_modal')
let zoomRange = document.getElementById('zoom'); 
//zoom html
zoomRange.addEventListener('input', (e) => { 
  zoom_offset = e.target.value
  widthZoomAdjust = (width/2) - (width/2 * zoom_offset)
  heightZoomAdjust = (height/2) - (height/2 * zoom_offset)
})
//planets mass modal
showModal.addEventListener('click', () => { 
  planetsMassDiv.style.display = 'block'
})
hideModal.addEventListener('click', () => { 
  planetsMassDiv.style.display = 'none'
})
//planets mass html
planets.forEach((planet) => { 
  let curInput = document.createElement('input')
  curInput.setAttribute('placeholder', `${planet.name} (${planet.mass})`)
  curInput.setAttribute('id', `${planet.name}_mass`)
  curInput.setAttribute('class', 'planet_mass_input')
  curInput.setAttribute('type', 'range')
  curInput.setAttribute('min', '0')
  curInput.setAttribute('max', '20000')
  curInput.setAttribute('step', '1')
  
  curInput.innerHTML = planet.mass
  curInput.addEventListener('input',(e) => { 
    console.log(e.target.value)
    planet.mass = e.target.value
  })

  curInput.value = planet.mass
  planetsMassDiv.appendChild(curInput)
});


//astroid html
astroid_count_tag.addEventListener('input', () => { 
  astroid_count = parseInt(astroid_count_tag.value)
})

astroid_count_button.addEventListener('click', (e) => { 
  generateAstroids(astroid_count, 3, [width/3, height/3])
})

//key presses
function keyPressed() {
  if (keyCode === UP_ARROW) {
    global_y_offset += 40;
  } else if (keyCode === DOWN_ARROW) {
    global_y_offset -= 40;
  } else if (keyCode === RIGHT_ARROW) {
    global_x_offset -= 40;
  } else if (keyCode === LEFT_ARROW) {
    global_x_offset += 40;
  }
}
//processing setup
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0)
  canvas.style('z-index', '-1')
}
//processing draw
function draw() {
  background(0);
  renderObjects(objects, global_x_offset, global_y_offset); 
}
