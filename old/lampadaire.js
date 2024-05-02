///////////////////////////////////////////
// Paramètres à renseigner manuellement //
/////////////////////////////////////////
const échelle = 0.75;
const x = 250;
const y = 490;

const couleur_base = '#202020';
const couleur_tronc = '#006400';
const couleur_halo = 'yellow';

const hauteur_base = 10*échelle;
const largeur_base = 50*échelle;

const hauteur_base_tronc = 100*échelle;
const hauteur_tronc = 280*échelle;
const largeur_tronc = 20*échelle;

const rayon_boule = 70*échelle;
const angle_base_boule = Math.PI/5;

let init = true;
let halo_test;

////////////////////////////////////////////////
// Initialisation des paramètres automatique //
//////////////////////////////////////////////



function setup() {
  createCanvas(500, 500);
  noStroke();
  frameRate(68);
}

function draw() {
  background(50);
  if (init){
    halo_test = new Halo(0,0);
    init = false;
  }
  
  // stroke("black");
  translate(x,y);

  // 1er étage (hauteur = hauteur_base)
  translate(0,-hauteur_base);
  fill(couleur_base);
  rect(-largeur_base/2,0,largeur_base,hauteur_base);
  arc(largeur_base/2,hauteur_base,hauteur_base*2,hauteur_base*2,-HALF_PI,0);
  arc(-largeur_base/2,hauteur_base,hauteur_base*2,hauteur_base*2,PI,-HALF_PI);

  // 2ème étage (hauteur = hauteur_base_tronc)
  translate(0,-hauteur_base_tronc);
  fill(couleur_tronc);
  rect(-largeur_base/2, 0,largeur_base,hauteur_base_tronc);

  // 3ème étage (hauteur = hauteur_base)
  translate(0,-hauteur_base);
  fill(couleur_base);
  rect(-largeur_base/2,0,largeur_base,hauteur_base);
  arc(largeur_base/2,hauteur_base/2,hauteur_base,hauteur_base,-HALF_PI,HALF_PI);
  arc(-largeur_base/2,hauteur_base/2,hauteur_base,hauteur_base,HALF_PI,-HALF_PI);

  // 4ème étage (hauteur = hauteur_base/2)
  translate(0,-hauteur_base/2);
  fill(couleur_base);
  rect(-largeur_tronc/2,0,largeur_tronc,hauteur_base/2);
  arc(largeur_tronc/2,hauteur_base/2,hauteur_base,hauteur_base,-HALF_PI,0);
  arc(-largeur_tronc/2,hauteur_base/2,hauteur_base,hauteur_base,PI,-HALF_PI);

  // 5ème étage (hauteur = hauteur_tronc)
  translate(0,-hauteur_tronc);
  fill(couleur_tronc);
  rect(-largeur_tronc/2,0,largeur_tronc,hauteur_tronc);

  // 6ème étage (hauteur = hauteur_base/2)
  translate(0,-hauteur_base/2);
  fill(couleur_base);
  rect(-largeur_tronc/2,0,largeur_tronc,hauteur_base/2);
  arc(largeur_tronc/2,hauteur_base/4,hauteur_base/2,hauteur_base/2,-HALF_PI,HALF_PI);
  arc(-largeur_tronc/2,hauteur_base/4,hauteur_base/2,hauteur_base/2,HALF_PI,-HALF_PI);
  
  // base boule (hauteur = en fonction de l'angle angle_base_boule)
  translate(0,hauteur_base/2 - rayon_boule/2);
  fill(couleur_base);
  arc(0,0,rayon_boule,rayon_boule,HALF_PI-angle_base_boule,HALF_PI+angle_base_boule,CHORD);

  // boule (hauteur = en fonction de l'angle angle_base_boule)
  fill(couleur_halo);
  arc(0,0,rayon_boule,rayon_boule,HALF_PI+angle_base_boule,HALF_PI-angle_base_boule,CHORD);

  // Centre lumière
  // fill("green");
  // arc(0,0,rayon_boule/4,rayon_boule/4,0,TWO_PI);

  // Ajout du halo
  
  halo_test.draw();
}

class Halo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rayon_halo_min = 100;
    this.rayon_halo_max = 105;
    this.intensite_halo = 10;
    this.rayon_halo = this.rayon_halo_min;
    this.isGrowing = true;
    this.temps_evolution_halo = 1; // temps en seconde
    this.vitesse_evolution_halo = (this.rayon_halo_max - this.rayon_halo_min)/(this.temps_evolution_halo*frameRate());
  }

  draw() { 
    push();
    fill(120, 90, 5, this.intensite_halo);
    blendMode(ADD);
    for (let r = 0.0; r < 0.5; r += 0.01) {
      circle(this.x, this.y, this.rayon_halo *4*r);
    }
    pop();

    if(this.rayon_halo > this.rayon_halo_max){
      this.isGrowing = false;
    }
    else if(this.rayon_halo < this.rayon_halo_min){
      this.isGrowing = true;
    }

    if(this.isGrowing){
      this.rayon_halo += this.vitesse_evolution_halo;
    } else {
      this.rayon_halo -= this.vitesse_evolution_halo;
    }
  }
}