///////////////////////////////////////////
// Paramètres à renseigner manuellement //
/////////////////////////////////////////

const rain_density = 1; // Nombre de gouttes par frame
const rain_len_min = 10; // Longueur minimale des gouttes
const rain_len_rand = 10; // Longueur variable des gouttes
const rain_width_rand = 2; // Largeur variable des gouttes
const rain_speed_min = 8; // Vitesse minimale des gouttes
const rain_speed_rand = 3; // vitesse variable des gouttes
const angle_goutte = 3*Math.PI/8; // angle initiale des gouttes

const rain_eclaboussure_min = 5;
const rain_eclaboussure_rand = 5;

const gravity = .5; // Vitesse a laquelle les eclaboussures retombent
let particles = [];
////////////////////////////////////////////////
// Initialisation des paramètres automatique //
//////////////////////////////////////////////

let cote_rand; // Sert à choisir aléatoirement si une goutte apparait soit sur le coté, soit sur le haut
let rain_drop_start_theorique; // à partir de quelle hauteur la goutte peut apparaitre

// Si l'angle d'apparition des gouttes est supérieur à PI/2, alors le calcul n'est pas le même. Variable intermédiaire servant à alléger les fonctions en supprimant des if inutiles
let angle_goutte_calcul; 

if (angle_goutte > Math.PI / 2){
  angle_goutte_calcul = Math.PI/2-angle_goutte;
} else {
  angle_goutte_calcul = angle_goutte;
}

let y_first_drop = 0; // 

let RainDropsClean = [];
let compteur_clean = 0;
let RainDrops = [];

let tot = 0;
let distrib = 0;
function setup() {
  createCanvas(500, 500);

  noStroke();
  frameRate(68);

  let wind_of_change = createVector(1,0);
  
}

function draw() {
  background(50);

  addDrop(rain_density);

  for (let i = 0; i < RainDrops.length - 1; i++) {
    let drop = RainDrops[i];
    if (drop.y > y_first_drop & y_first_drop <height) {y_first_drop = drop.y};
    if (drop.sol >= height){drop.eclaboussure()};
    if (drop.x > width || drop.y > height || drop.x < 0){drop.isAlive = false};
  drop.draw();
}

RainDrops = RainDrops.filter((p) => p.isAlive);

particles.forEach((p) => {
  p.step();
  p.draw();
});
particles = particles.filter((p) => p.isAlive);
}

// function addDrop(amount) {
//   for (let i = 0; i < amount; i++) {
//     let random_number = random(width + y_first_drop);
//     if (random_number < y_first_drop){
//       cote_rand = 0;
//     } else {
//       cote_rand = PI/2;
//     }
//     let newDrop = new RainDrop(sin(cote_rand)*(random(random_number)), cos(cote_rand)*(random(y_first_drop)));
//     RainDrops.push(newDrop);
//   }
// }

function addDrop(amount) {
  if (angle_goutte == Math.PI/2){
    rain_drop_start_theorique = 0;
  } else {
    rain_drop_start_theorique = y_first_drop/cos(angle_goutte_calcul);
  }

  for (let i = 0; i < amount; i++) {
    let random_number = random(width + rain_drop_start_theorique);
    if (random_number < width){
      cote_rand = 0;
      // console.log(cos(cote_rand)*floor(angle_goutte/(Math.PI/2))*width + sin(cote_rand)*random(width));
    } else {
      cote_rand = PI/2;
    }
    let newDrop = new RainDrop(
      cos(cote_rand)*floor(angle_goutte/(Math.PI/2))*width + sin(cote_rand)*random(width),
      cos(cote_rand)*random(y_first_drop));
    RainDrops.push(newDrop);
    
  }
}
 
class RainDrop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = rain_speed_min + random(rain_speed_rand);
    this.width = random(rain_width_rand);
    this.length_max = rain_len_min+random(rain_len_rand);
    this.length = 1;
    this.angle = angle_goutte;
    this.sol = 0;
    this.isAlive = true;
  }

  draw() {
    push;
    stroke("white");
    strokeWeight(this.width);
    let r = min(this.length_max,this.length);
    line(this.x,this.y,this.x + r*cos(this.angle),this.y + r*sin(this.angle));
    pop;

    if(this.length < this.length_max){
      this.length += this.speed;
    } else {
      this.x += this.speed*cos(this.angle);
      this.y += this.speed*sin(this.angle);
    }

    if (this.angle > PI/2){
      this.sol = this.y + cos(this.angle - PI/2)*this.length;
    } else {
      this.sol = this.y + sin(this.angle)*this.length;
    }
  }



  wind(wind_force){
    this.x = (wind_force.x/this.length_max) + this.x;
    this.y = (wind_force.y/this.length_max) + this.y;
  }

  eclaboussure(){
  let n = rain_eclaboussure_min + floor(random(rain_eclaboussure_rand));

  for (let i = 0; i < n; i++) {

    const angle = random(PI,TWO_PI);
    const xSpeed = cos(angle) * this.speed;
    const ySpeed = sin(angle) * this.speed;
    const size = this.width;

    particles.push(new Particle(this.x, this.y,
      xSpeed, ySpeed, size
      ));
    }
    this.isAlive = false;
  }

}

class Particle {
	constructor(x, y, xSpeed, ySpeed, size) {
		this.x = x;
		this.y = y;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.size = size;
		this.isAlive = true;
	}

	step() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;

		this.ySpeed += gravity;

		if (this.y > height) {
			this.isAlive = false;
		}
	}

	draw() {
		fill("white");
		noStroke();
		rect(this.x, this.y, this.size, this.size);

	}
}