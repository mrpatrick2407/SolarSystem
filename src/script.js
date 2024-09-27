import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { distance } from "three/webgpu";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();
//intialize planets
const cubeMaptexture = new THREE.CubeTexture()
// initialize the scene
const scene = new THREE.Scene();
const axis=new THREE.AxesHelper(70)
// initialize the loader 
const textureLoader = new THREE.TextureLoader()
const sunTexture=textureLoader.load('./8k_sun.jpg')
const moonTexture=textureLoader.load('./8k_moon.jpg')
const earthTexture=textureLoader.load('./8k_earth_daymap.jpg')
const jupiterTexture=textureLoader.load('./8k_jupiter.jpg')
const marsTexture=textureLoader.load('./8k_mars.jpg')
const mercuryTexture=textureLoader.load('./8k_mercury.jpg')
const saturnTexture=textureLoader.load('./8k_saturn.jpg')
const milkywayTexture=textureLoader.load('./8k_stars_milky_way.jpg')
const venusSurfaceTexture=textureLoader.load('./8k_venus_surface.jpg')
const venusAtmosphereTexture=textureLoader.load('./4k_venus_atmosphere.jpg')
//add materials
const mercuryMaterial=new THREE.MeshStandardMaterial({map:mercuryTexture})
const moonMaterial=new THREE.MeshStandardMaterial({map:moonTexture})
const earthMaterial=new THREE.MeshStandardMaterial({map:earthTexture})
const jupiterMaterial=new THREE.MeshStandardMaterial({map:jupiterTexture})
const marsMaterial=new THREE.MeshStandardMaterial({map:marsTexture})
const saturnMaterial=new THREE.MeshStandardMaterial({map:saturnTexture})
const milkywayMaterial= new THREE.MeshBasicMaterial({map:milkywayTexture})
const venusSurfaceMaterial= new THREE.MeshStandardMaterial({map:venusSurfaceTexture})
const venusAtmosphereMaterial= new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0.3,
  color: 0xFFFFCC,
  side: THREE.DoubleSide,
map:venusAtmosphereTexture})
// initialize the geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture
})
const Sun= new THREE.Mesh(sphereGeometry, sunMaterial);
Sun.scale.setScalar(10)
const cubemap=new THREE.CubeTextureLoader().setPath('./Standard-Cube-Map\\').load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] )
// const earthMaterial = new THREE.MeshBasicMaterial({
//   color:'blue'
// })
// const Earth = new THREE.Mesh(sphereGeometry, earthMaterial);
// Earth.scale.setScalar(1)
// Earth.position.x=10
const moon = new THREE.Mesh(sphereGeometry, moonMaterial); 
moon.scale.setScalar(.5);
moon.position.x=2


const planets=[{
  name: 'Earth',
  radius: 1,
  speed: 0.01,
  distance: 15,
  material: earthMaterial,
  moons: [
    {
      name: 'Moon',
      radius: 0.27,
      speed: 0.03,
      distance: 2,
      material: moonMaterial
    }
  ]
},
{
  name: 'Mars',
  radius: 0.53,
  speed: 0.015,
  distance: 22.5,
  material: marsMaterial,
  moons: [
    {
      name: 'Phobos',
      radius: 0.2,
      speed: 0.02,
      distance: 1.2,
      material: moonMaterial
    },
    {
      name: 'Deimos',
      radius: 0.1,
      speed: 0.015,
      distance: 2,
      material: moonMaterial
    }
  ]
},
{
  name: 'Jupiter',
  radius: 3,
  speed: 0.01,
  distance: 50,
  material: jupiterMaterial,
  moons: []
},
{
  name: 'Saturn',
  radius: 2.5,
  speed: 0.015,
  distance: 65,
  material: saturnMaterial,
  moons: []
},
{
  name: 'Venus',
  radius: 0.95,
  speed: 0.0075,
  distance: 30,
  material: venusSurfaceMaterial,
  moons: [],
  atmosphere:{
    material:venusAtmosphereMaterial,
    opacity: 0.3,
    transparent: true,
    color: 0xFFFFCC,
    side: THREE.DoubleSide,
  }
}
]
const createMoon=(moon)=>{
  const moonMesh=new THREE.Mesh(sphereGeometry, moon.material)
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x=moon.distance
  // moonMesh.position.y=moon.distance
  return moonMesh
}
const createPlanet=(i)=>{
  const mesh=new THREE.Mesh(sphereGeometry, i.material)
  mesh.scale.setScalar(i.radius)
  mesh.position.x=i.distance
  return mesh
}
const testPlanetMeshses=planets.map(i=>{
  if(Object.hasOwn(i,'atmosphere')){
    const group = new THREE.Group();
    const mesh=createPlanet(i)
  const moon=i.moons.map(moon=>{
    const moonMesh=createMoon(moon)
    return moonMesh
  })
  mesh.add(...moon)
  const venusAtmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(i.radius * 1.05, 64, 64),
    venusAtmosphereMaterial
  );
  group.add(venusAtmosphere,mesh)
  return group
  }
  const mesh=createPlanet(i)
  const moon=i.moons.map(moon=>{
    const moonMesh=createMoon(moon)
    return moonMesh
  })
  mesh.add(...moon)
  return mesh
})

//
scene.add(...testPlanetMeshses)
scene.add(Sun)
const ambientLight= new THREE.AmbientLight(0xffffff,10)
const pointLight = new THREE.PointLight(0xffffff,3000)
scene.add(pointLight)
scene.background=cubemap
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
// camera.position.z = -10;
camera.position.z = 20;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  antialias:true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock=new THREE.Clock()
// render the scene
const renderloop = () => {
testPlanetMeshses.map((e,i)=>{
e.rotation.y+=planets[i].speed
e.position.x=Math.sin(e.rotation.y)*planets[i].distance
e.position.z=Math.cos(e.rotation.y)*planets[i].distance
e.children.forEach((moon,index)=>{
  if(planets[i].moons.length!=0){
    moon.rotation.y+=planets[i].moons[index].speed
  moon.position.x=Math.sin(moon.rotation.y)*planets[i].moons[index].distance
  moon.position.z=Math.cos(moon.rotation.y)*planets[i].moons[index].distance
  }
})
})
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();