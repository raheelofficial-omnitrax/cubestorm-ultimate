/**
 * CUBESTORM ULTIMATE — BUILD 3.0
 * Description: A modular 3D cube-survival game featuring 24 sectors, multiple
 *              modes, configurable arcade physics, enemy behaviours, boss
 *              encounters, weapons, missions, cosmetics and saved progression.
 * Key concepts: Three.js, fixed-step-friendly game loop, vectors, AABB collision,
 *               acceleration, gravity, jump buffering, coyote time, projectiles,
 *               procedural audio, local storage and responsive UI state.
 * Author: Muhammad Raheel Babar
 */
(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration and data
  // ---------------------------------------------------------------------------
  const CONFIG = {
    storageProfile: 'cubestormUltimateProfileV3',
    storageSettings: 'cubestormUltimateSettingsV3',
    stageDuration: 36,
    maxStages: 24,
    worldWidth: 15,
    worldDepth: 124,
    groundTop: -1.75,
    groundZ: -10,
    spawnZ: -58,
    playerZ: 10,
    playerSize: 1.1,
    maxParticles: 340,
    maxEnemies: 26,
    maxPickups: 45,
    maxBullets: 50,
    magazine: 12,
    maxLives: 5,
    rushDuration: 75,
  };

  const STAGES = [
    ['Neon Harbor','#071d32','#153f5b','#4de7f1','#0a2034'],
    ['Verdant Circuit','#0b2b2b','#155448','#4df0b2','#0b2927'],
    ['Solar Foundry','#321b22','#743c32','#ff9a69','#321d22'],
    ['Frostline','#10253d','#345b83','#8fe4ff','#142a45'],
    ['Violet Expanse','#21143e','#493272','#bb8cff','#241943'],
    ['Cinder Valley','#351a15','#793b26','#ff805d','#351d1a'],
    ['Skyline Rush','#112b48','#285c7d','#62d5ff','#15314f'],
    ['Toxic Gardens','#1d3020','#405f2d','#b5ee5c','#1e301c'],
    ['Deep Space','#090e2d','#252e67','#7b88ff','#0c1236'],
    ['Crystal Caverns','#102b38','#256070','#64f1dc','#12313b'],
    ['Obsidian Run','#171a24','#373d4b','#f0a4ff','#191c29'],
    ['Last Dimension','#260e26','#54234e','#ff6eae','#260f2b'],
    ['Aurora Heights','#102d3b','#28616a','#9cf7d8','#102c3d'],
    ['Clockwork City','#252516','#62552c','#f4d56a','#292515'],
    ['Quantum Garden','#171f3b','#354a79','#86a8ff','#17213e'],
    ['Magma Station','#32130f','#73301e','#ff704b','#321711'],
    ['Moonlit Coast','#12283d','#34536e','#a6dcff','#142b43'],
    ['Emerald Vault','#10251d','#28553b','#69f0a5','#112a22'],
    ['Prism Palace','#2a173d','#5a3675','#ffa6f4','#2b1940'],
    ['Thunder Plains','#182338','#3f527b','#83aaff','#1a2943'],
    ['Mirage Desert','#352616','#76502c','#ffc36a','#352919'],
    ['Binary Abyss','#0d1126','#202c54','#6c8bff','#0e1430'],
    ['Solar Cathedral','#33251b','#72533a','#ffe08a','#36291f'],
    ['Eternal Core','#260f22','#5c2447','#ff82c8','#2b122a'],
  ].map(([name,sky,floor,glow,fog],i)=>({name,sky,floor,glow,fog,map:String(i+1).padStart(2,'0')}));

  const DIFFICULTIES = {
    story:    { label:'Story',    speed:.76, spawn:1.35, lives:5, enemyHp:1, score:.8 },
    easy:     { label:'Easy',     speed:.88, spawn:1.16, lives:4, enemyHp:1, score:.9 },
    normal:   { label:'Normal',   speed:1,   spawn:1,    lives:3, enemyHp:1, score:1 },
    hard:     { label:'Hard',     speed:1.16,spawn:.84,  lives:2, enemyHp:2, score:1.3 },
    nightmare:{ label:'Nightmare',speed:1.34,spawn:.72, lives:1, enemyHp:2, score:1.7 },
  };

  const ENEMIES = {
    normal:   { color:'#ff5f78', size:1.25, speed:1, hp:1, score:15 },
    runner:   { color:'#ff9b55', size:.86, speed:1.55, hp:1, score:22 },
    heavy:    { color:'#a783ff', size:2.0, speed:.72, hp:3, score:38 },
    zigzag:   { color:'#fa75d1', size:1.08, speed:1.08, hp:1, score:26 },
    hopper:   { color:'#ffbf58', size:1.12, speed:1.05, hp:1, score:27 },
    splitter: { color:'#75d8ff', size:1.35, speed:.92, hp:2, score:34 },
    prism:    { color:'#a6ffdc', size:1.22, speed:1.12, hp:2, score:36 },
    guardian: { color:'#ff315f', size:3.5, speed:.55, hp:22, score:450 },
  };

  const POWER_COLORS = {
    shield:'#56eaff', slow:'#ffdf68', double:'#7effb0', life:'#ff8bc1',
    magnet:'#c49bff', rapid:'#ffad65', multi:'#86b8ff', repair:'#8cffbb',
  };

  const SKINS = [
    {name:'Cyan Pulse',color:'#5ce6f3',price:0,desc:'A clean energy finish.'},
    {name:'Royal Violet',color:'#9580ff',price:80,desc:'A quiet but powerful glow.'},
    {name:'Solar Flare',color:'#ffc76a',price:100,desc:'Warm solar alloy.'},
    {name:'Rose Circuit',color:'#ff8db9',price:120,desc:'A bright rose finish.'},
    {name:'Emerald Drive',color:'#8cff9d',price:140,desc:'A fresh green pulse.'},
    {name:'Arctic Glass',color:'#e8f5ff',price:160,desc:'A cool, polished shell.'},
    {name:'Crimson Byte',color:'#ff735f',price:180,desc:'A vivid red core.'},
    {name:'Skyline Blue',color:'#63a6ff',price:200,desc:'A deep electric blue.'},
    {name:'Toxic Lime',color:'#cbff52',price:220,desc:'High-visibility lime.'},
    {name:'Amethyst',color:'#d09bff',price:240,desc:'A violet crystal finish.'},
    {name:'Ocean Glass',color:'#51ffd9',price:260,desc:'A bright ocean shimmer.'},
    {name:'Supernova',color:'#ff76e0',price:300,desc:'A rare cosmic finish.'},
  ];

  const TRAILS = [
    {name:'Cyan',color:'#59e7f2'},{name:'Violet',color:'#ac8bff'},
    {name:'Gold',color:'#ffd071'},{name:'Rose',color:'#ff7fbd'},
    {name:'Mint',color:'#70f0b3'},{name:'Ice',color:'#d8f4ff'},
  ];

  const MISSIONS = [
    {type:'dodge',target:9,title:'THREAD THE NEEDLE',reward:120},
    {type:'coins',target:6,title:'SPARK COLLECTOR',reward:140},
    {type:'kills',target:5,title:'CLEAR THE PATH',reward:160},
    {type:'coins',target:9,title:'TREASURE RUN',reward:180},
    {type:'dodge',target:14,title:'UNTOUCHABLE',reward:200},
    {type:'shots',target:12,title:'PRECISION ENGINE',reward:170},
    {type:'power',target:3,title:'SYSTEMS ONLINE',reward:150},
    {type:'kills',target:8,title:'CUBE BREAKER',reward:220},
  ];

  const ACHIEVEMENTS = [
    ['first_run','First Contact','Complete your first run.'],
    ['coin_25','Pocket Change','Collect 25 energy coins.'],
    ['coin_100','Coin Architect','Collect 100 energy coins.'],
    ['score_1000','Four Digits','Reach a score of 1,000 in one run.'],
    ['score_5000','High Voltage','Reach a score of 5,000 in one run.'],
    ['kills_25','Cube Collector','Destroy 25 enemies.'],
    ['kills_100','Dimension Defender','Destroy 100 enemies.'],
    ['dodge_25','Untouchable','Dodge 25 enemies.'],
    ['combo_10','Chain Reaction','Reach a 10× combo chain.'],
    ['boss_1','Guardian Down','Defeat a sector guardian.'],
    ['stage_5','World Hopper','Reach sector 5.'],
    ['stage_12','Halfway There','Reach sector 12.'],
    ['stage_24','Beyond the Edge','Complete all 24 campaign sectors.'],
    ['skin_5','Style Explorer','Unlock five cube finishes.'],
    ['power_20','Power Network','Collect 20 power-ups.'],
    ['rush_60','Against the Clock','Survive 60 seconds in Time Rush.'],
    ['dash_20','Dash Specialist','Dash 20 times.'],
    ['jump_50','Airborne','Jump 50 times.'],
  ];

  const DEFAULT_SETTINGS = {
    quality:'medium', cameraDistance:27, fov:82, cameraMode:'chase',
    cameraShake:true, radarEnabled:true, fpsEnabled:true, particlesEnabled:true,
    trailsEnabled:true, starsEnabled:true, fogEnabled:true, shadowsEnabled:true,
    glowEnabled:true, reduceFlashes:false, highContrast:false,
    soundEnabled:true, masterVolume:0.65, uiSounds:true,
    playerColor:'#5ce6f3', trailColor:'#59e7f2', playerShape:'cube',
    trailStyle:'sparks', hudScale:100, fieldOfView:82,
    moveSpeed:9.2, gravity:25, jumpPower:10.2, airControl:0.82,
    dashPower:22, dashCooldown:1.35, trackWidth:15,
    autoReload:true, aimAssist:true, autoFire:false,
    mouseSensitivity:1, invertY:false,
    showDamageNumbers:true, showTutorialTips:true,
  };

  const SETTING_GROUPS = [
    {title:'VISUAL QUALITY',items:[
      ['quality','select','Graphics quality','Balance image quality and performance',[['low','Performance'],['medium','Balanced'],['high','Ultra']]],
      ['shadowsEnabled','toggle','Dynamic shadows','Real-time directional shadows'],
      ['glowEnabled','toggle','Emissive glow','Glowing materials and energy accents'],
      ['particlesEnabled','toggle','Particle effects','Impact bursts and collectible effects'],
      ['trailsEnabled','toggle','Player trail','Leave a colored movement trail'],
      ['starsEnabled','toggle','Animated starfield','Show the distant star layer'],
      ['fogEnabled','toggle','Atmospheric fog','Biome-specific distance fog'],
    ]},
    {title:'CAMERA & HUD',items:[
      ['cameraMode','select','Camera mode','Choose your view',[['chase','Chase camera'],['close','Close chase'],['first','First person']]],
      ['cameraDistance','range','Camera distance','How far the camera follows you',20,38,1],
      ['fov','range','Field of view','Wider views show more of the arena',65,100,1],
      ['cameraShake','toggle','Camera shake','Impact feedback during collisions'],
      ['radarEnabled','toggle','Threat radar','Show approaching enemies'],
      ['fpsEnabled','toggle','FPS counter','Show the live frame rate'],
      ['hudScale','range','HUD scale','Resize the in-game interface',80,120,5],
    ]},
    {title:'PHYSICS & MOVEMENT',items:[
      ['moveSpeed','range','Movement speed','Ground and air movement speed',6,13,.2],
      ['gravity','range','Gravity','Higher values create faster falls',14,36,1],
      ['jumpPower','range','Jump force','Initial vertical jump velocity',7,14,.2],
      ['airControl','range','Air control','How quickly movement changes in air',.2,1.4,.05],
      ['dashPower','range','Dash power','Velocity while dashing',14,30,1],
      ['dashCooldown','range','Dash cooldown','Time between dashes',.6,2.5,.05],
      ['trackWidth','range','Track width','Wider tracks are more forgiving',11,18,.5],
    ]},
    {title:'COMBAT & ASSISTS',items:[
      ['autoReload','toggle','Automatic reload','Reload when the magazine is empty'],
      ['aimAssist','toggle','Aim assistance','Gently guide shots toward a nearby target'],
      ['autoFire','toggle','Hold-to-fire','Automatically fire while the key is held'],
      ['showDamageNumbers','toggle','Hit feedback','Show hit notifications'],
      ['mouseSensitivity','range','Aim guidance strength','Adjust how strongly assisted shots track targets',.5,2,.1],
      ['invertY','toggle','Invert vertical input','Invert gamepad vertical movement'],
    ]},
    {title:'COLOR & ACCESSIBILITY',items:[
      ['playerColor','color','Player tint','Override the equipped cube tint'],
      ['trailColor','color','Trail tint','Customize the movement trail'],
      ['playerShape','select','Cube geometry','Change the visual player shape',[['cube','Cube'],['octa','Octahedron'],['icosa','Icosahedron'],['dodeca','Dodecahedron'],['tetra','Tetrahedron']]],
      ['trailStyle','select','Trail style','Select a particle trail pattern',[['sparks','Energy sparks'],['dots','Soft dots'],['shards','Crystal shards'],['off','No trail']]],
      ['reduceFlashes','toggle','Reduce flashes','Tone down bright impact feedback'],
      ['highContrast','toggle','High contrast HUD','Increase interface contrast'],
      ['showTutorialTips','toggle','Gameplay tips','Show contextual help messages'],
    ]},
    {title:'AUDIO',items:[
      ['soundEnabled','toggle','Sound effects','Enable procedural sound effects'],
      ['masterVolume','range','Master volume','Overall game sound volume',0,1,.05],
      ['uiSounds','toggle','Interface sounds','Play feedback sounds for game events'],
    ]},
  ];

  // ---------------------------------------------------------------------------
  // DOM and profile
  // ---------------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const ui = {
    sceneMount:$('sceneMount'),hud:$('hud'),overlay:$('menuOverlay'),loading:$('loadingScreen'),
    fatal:$('fatalError'),fatalMessage:$('fatalMessage'),touch:$('touchControls'),
    score:$('scoreValue'),scoreGain:$('scoreGain'),stage:$('stageValue'),biome:$('stageBiome'),
    best:$('bestValue'),lives:$('livesValue'),coins:$('coinsValue'),combo:$('comboValue'),
    speed:$('speedValue'),power:$('powerStatus'),ammo:$('ammoValue'),modeLabel:$('modeLabel'),progress:$('stageProgressFill'),
    missionCard:$('missionCard'),mission:$('missionName'),missionFill:$('missionFill'),
    missionProgress:$('missionProgress'),missionReward:$('missionReward'),bossPanel:$('bossPanel'),
    bossFill:$('bossHealthFill'),bossText:$('bossHealthText'),radar:$('radar'),radarPlayer:$('radarPlayer'),
    radarThreats:$('radarThreats'),radarText:$('radarText'),fps:$('fpsCounter'),crosshair:$('crosshair'),
    message:$('worldMessage'),toast:$('toast'),menuBest:$('menuBest'),menuWallet:$('menuWallet'),
    menuUnlocked:$('menuUnlocked'),rank:$('rankLabel'),difficulty:$('difficultySelect'),
    modeButtons:[...document.querySelectorAll('.mode-card')],levelGrid:$('levelGrid'),levelHint:$('levelHint'),
    startSelected:$('startSelected'),settingsMount:$('settingsMount'),skinGrid:$('skinGrid'),
    garageCube:$('garageCube'),skinName:$('skinName'),skinDescription:$('skinDescription'),
    garageWallet:$('garageWallet'),equipSkin:$('equipSkin'),achievementGrid:$('achievementGrid'),
  };

  const defaultProfile = {
    best:0,wallet:0,maxUnlocked:1,skin:0,trail:0,unlockedSkins:[0],achievements:[],
    totalRuns:0,totalCoins:0,totalKills:0,totalDodges:0,totalJumps:0,totalDashes:0,
    totalPowerups:0,bossesDefeated:0,history:[],
  };
  let profile = {...defaultProfile};
  let settings = {...DEFAULT_SETTINGS};
  try {
    const storedProfile = JSON.parse(localStorage.getItem(CONFIG.storageProfile) || '{}');
    const storedSettings = JSON.parse(localStorage.getItem(CONFIG.storageSettings) || '{}');
    profile = {...profile,...storedProfile};
    settings = {...settings,...storedSettings};
  } catch (error) { console.warn('Cubestorm save data could not be read; defaults loaded.',error); }
  profile.maxUnlocked = clampInt(profile.maxUnlocked,1,CONFIG.maxStages,1);
  profile.wallet = clampInt(profile.wallet,0,99999999,0);
  profile.best = clampInt(profile.best,0,999999999,0);
  profile.skin = clampInt(profile.skin,0,SKINS.length-1,0);
  profile.unlockedSkins = Array.isArray(profile.unlockedSkins) ? [...new Set([0,...profile.unlockedSkins.filter(n=>Number.isInteger(n)&&n>=0&&n<SKINS.length)])] : [0];
  if(!profile.unlockedSkins.includes(profile.skin))profile.skin=0;
  profile.achievements = Array.isArray(profile.achievements) ? profile.achievements : [];
  profile.history = Array.isArray(profile.history) ? profile.history.slice(0,12) : [];
  for(const key of ['totalRuns','totalCoins','totalKills','totalDodges','totalJumps','totalDashes','totalPowerups','bossesDefeated'])profile[key]=Math.max(0,Number(profile[key])||0);
  for (const key of Object.keys(DEFAULT_SETTINGS)) if (typeof settings[key] !== typeof DEFAULT_SETTINGS[key]) settings[key] = DEFAULT_SETTINGS[key];
  for(const group of SETTING_GROUPS){
    for(const item of group.items){
      const [key,type,...rest]=item;
      if(type==='range'){const min=rest[2],max=rest[3];settings[key]=clamp(Number(settings[key]),min,max);}
      else if(type==='select'){const options=rest[2].map(option=>option[0]);if(!options.includes(settings[key]))settings[key]=DEFAULT_SETTINGS[key];}
      else if(type==='toggle')settings[key]=Boolean(settings[key]);
      else if(type==='color'&&!/^#[0-9a-f]{6}$/i.test(settings[key]))settings[key]=DEFAULT_SETTINGS[key];
    }
  }

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function clampInt(value,min,max,fallback){const number=Number(value);return Number.isFinite(number)?Math.round(clamp(number,min,max)):fallback;}
  const smooth=(speed,dt)=>1-Math.exp(-speed*dt);
  const choice=(array)=>array[Math.floor(Math.random()*array.length)];
  const rand=(min,max)=>min+Math.random()*(max-min);
  const fmt=(n)=>Math.floor(n).toLocaleString();

  function saveProfile(){
    try{localStorage.setItem(CONFIG.storageProfile,JSON.stringify(profile));}
    catch(error){console.warn('Could not save profile.',error);}
    updateProfileUI();
  }
  function saveSettings(){
    try{localStorage.setItem(CONFIG.storageSettings,JSON.stringify(settings));}
    catch(error){console.warn('Could not save settings.',error);}
  }
  function updateProfileUI(){
    ui.menuBest.textContent=fmt(profile.best);
    ui.menuWallet.textContent=fmt(profile.wallet);
    ui.menuUnlocked.textContent=`${profile.maxUnlocked} / ${CONFIG.maxStages}`;
    ui.garageWallet.textContent=fmt(profile.wallet);
    const rank=profile.best>=25000?'DIMENSION LEGEND':profile.best>=10000?'CORE COMMANDER':profile.best>=5000?'ELITE RUNNER':profile.best>=1000?'SECTOR VETERAN':'ROOKIE EXPLORER';
    ui.rank.textContent=rank;
  }
  updateProfileUI();

  // ---------------------------------------------------------------------------
  // Three.js engine and environment
  // ---------------------------------------------------------------------------
  if(!window.THREE){
    ui.loading.classList.add('hidden');ui.fatal.classList.remove('hidden');
    ui.fatalMessage.textContent='Three.js did not load. Check your internet connection and reload; the engine is loaded from a CDN.';
    return;
  }
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(STAGES[0].sky);
  scene.fog=new THREE.Fog(STAGES[0].fog,settings.fogEnabled?80:500,settings.fogEnabled?175:700);
  const camera=new THREE.PerspectiveCamera(settings.fov,innerWidth/innerHeight,.1,240);
  camera.position.set(0,10,38);
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}
  catch(error){ui.loading.classList.add('hidden');ui.fatal.classList.remove('hidden');ui.fatalMessage.textContent='WebGL could not initialize. Enable browser hardware acceleration and try a supported browser.';console.error(error);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,settings.quality==='high'?1.8:settings.quality==='low'?1:1.35));
  renderer.setSize(innerWidth,innerHeight);
  renderer.shadowMap.enabled=settings.shadowsEnabled&&settings.quality!=='low';
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.1;
  if('outputColorSpace' in renderer&&THREE.SRGBColorSpace)renderer.outputColorSpace=THREE.SRGBColorSpace;
  ui.sceneMount.appendChild(renderer.domElement);

  const ambient=new THREE.HemisphereLight(0xc3e8ff,0x142237,1.35);scene.add(ambient);
  const keyLight=new THREE.DirectionalLight(0xffffff,2.15);keyLight.position.set(-9,19,12);keyLight.castShadow=renderer.shadowMap.enabled;
  keyLight.shadow.mapSize.set(1024,1024);keyLight.shadow.camera.left=-24;keyLight.shadow.camera.right=24;keyLight.shadow.camera.top=30;keyLight.shadow.camera.bottom=-25;keyLight.shadow.camera.far=100;scene.add(keyLight);
  const rimLight=new THREE.PointLight(STAGES[0].glow,1.5,70);rimLight.position.set(0,6,-18);scene.add(rimLight);

  const worldGroup=new THREE.Group();scene.add(worldGroup);
  const sceneryGroup=new THREE.Group();scene.add(sceneryGroup);
  const groundTop=CONFIG.groundTop;
  const groundMaterial=new THREE.MeshStandardMaterial({color:STAGES[0].floor,roughness:.72,metalness:.2});
  const groundMesh=new THREE.Mesh(new THREE.BoxGeometry(CONFIG.worldWidth,.5,CONFIG.worldDepth),groundMaterial);
  groundMesh.position.set(0,-2,CONFIG.groundZ);groundMesh.receiveShadow=true;scene.add(groundMesh);
  const railMaterial=new THREE.MeshStandardMaterial({color:STAGES[0].glow,emissive:STAGES[0].glow,emissiveIntensity:.75,metalness:.35,roughness:.32});
  const rails=[];
  for(const side of [-1,1]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.14,.17,116),railMaterial.clone());rail.position.set(side*7.58,groundTop+.12,-10);scene.add(rail);rails.push(rail);}
  const laneMarkers=[];
  const laneMaterial=new THREE.MeshBasicMaterial({color:'#def9ff',transparent:true,opacity:.2});
  for(const x of [-2.5,2.5])for(let z=-67;z<=43;z+=7){const mark=new THREE.Mesh(new THREE.BoxGeometry(.035,.018,2.3),laneMaterial);mark.position.set(x,groundTop+.012,z);scene.add(mark);laneMarkers.push(mark);}
  const STAR_COUNT=420;const starPositions=new Float32Array(STAR_COUNT*3);
  for(let i=0;i<STAR_COUNT;i++){starPositions[i*3]=rand(-58,58);starPositions[i*3+1]=rand(0,37);starPositions[i*3+2]=rand(-100,65);}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));
  const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:'#ecf8ff',size:.15,transparent:true,opacity:.85,sizeAttenuation:true}));scene.add(stars);

  const PLAYER_SIZE={width:CONFIG.playerSize,height:CONFIG.playerSize,depth:CONFIG.playerSize};
  const playerMaterial=new THREE.MeshStandardMaterial({color:settings.playerColor,roughness:.22,metalness:.42,emissive:settings.playerColor,emissiveIntensity:.32});
  const playerMesh=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.1,1.1),playerMaterial);playerMesh.castShadow=true;playerMesh.receiveShadow=true;scene.add(playerMesh);
  let playerEdges=null;let activePlayerShape=null;
  function updatePlayerGeometry(){
    if(activePlayerShape===settings.playerShape)return;
    activePlayerShape=settings.playerShape;
    let geometry;
    switch(settings.playerShape){
      case'octa':geometry=new THREE.OctahedronGeometry(.72,0);break;
      case'icosa':geometry=new THREE.IcosahedronGeometry(.69,0);break;
      case'dodeca':geometry=new THREE.DodecahedronGeometry(.69,0);break;
      case'tetra':geometry=new THREE.TetrahedronGeometry(.78,0);break;
      default:geometry=new THREE.BoxGeometry(1.1,1.1,1.1);
    }
    if(playerMesh.geometry)playerMesh.geometry.dispose();playerMesh.geometry=geometry;
    if(playerEdges){playerMesh.remove(playerEdges);playerEdges.geometry.dispose();playerEdges.material.dispose();}
    playerEdges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:'#f1ffff',transparent:true,opacity:.72}));playerMesh.add(playerEdges);
  }
  updatePlayerGeometry();
  const playerRing=new THREE.Mesh(new THREE.RingGeometry(.66,.75,40),new THREE.MeshBasicMaterial({color:STAGES[0].glow,transparent:true,opacity:.62,side:THREE.DoubleSide}));
  playerRing.rotation.x=-Math.PI/2;playerRing.position.y=groundTop+.025;scene.add(playerRing);

  const sharedParticleGeometry=new THREE.BoxGeometry(.16,.16,.16);
  const arrays={enemies:[],pickups:[],bullets:[],particles:[],trails:[]};
  const cameraDesired=new THREE.Vector3(),lookTarget=new THREE.Vector3();
  const playerVelocity=new THREE.Vector3();
  let gameState='menu';
  let activeMode='campaign',selectedMode='campaign',selectedDifficulty='normal',selectedLevel=1,currentStage=1,activeStartStage=1;
  let stageElapsed=0,totalElapsed=0,rushRemaining=CONFIG.rushDuration;
  let score=0,runCoins=0,lives=3,combo=0,bestCombo=0,kills=0,dodged=0,shotsFired=0,shotsHit=0;
  let jumpsThisRun=0,dashesThisRun=0,powerupsThisRun=0;
  let ammo=CONFIG.magazine,reloadTimer=0,fireCooldown=0,spawnTimer=.8,coinTimer=1.8,powerTimer=8,wallTimer=11;
  let dashTimer=0,dashCooldown=0,jumpBuffer=0,coyoteTimer=0,jumpCount=0,wasGrounded=true,previouslyGrounded=true;
  let shieldActive=false,slowTimer=0,doubleTimer=0,magnetTimer=0,rapidTimer=0,multiTimer=0;
  let invulnerabilityTimer=0,cameraShakeTimer=0,cameraShakePower=0,firstPerson=false,mutedByKey=false;
  let mission=null,missionProgress=0,missionComplete=false,boss=null,bossSpawned=false,bossDefeated=false;
  let scoreGainTimer=0,noticeTimer=0,toastTimer=0,fpsFrames=0,fpsElapsed=0,currentFPS=60;
  let audioContext=null,touchX=0,touchZ=0,touchShoot=false,mouseShoot=false,gamepadX=0,gamepadZ=0,gamepadShoot=false;
  let previousPadButtons={};let selectedSkin=profile.skin;let pointerActive=false;
  const keys=Object.create(null);const dashDirection=new THREE.Vector2(0,-1);const clock=new THREE.Clock();

  // ---------------------------------------------------------------------------
  // Shared rendering, notifications and audio helpers
  // ---------------------------------------------------------------------------
  function disposeMesh(mesh){if(!mesh)return;scene.remove(mesh);if(mesh.geometry&&mesh.geometry!==sharedParticleGeometry)mesh.geometry.dispose();if(Array.isArray(mesh.material))mesh.material.forEach(m=>m.dispose());else if(mesh.material)mesh.material.dispose();}
  function clearList(list){for(let i=list.length-1;i>=0;i--)disposeMesh(list[i].mesh||list[i]);list.length=0;}
  function clearRunObjects(){clearList(arrays.enemies);clearList(arrays.pickups);clearList(arrays.bullets);clearList(arrays.particles);clearList(arrays.trails);boss=null;}
  function notice(text,duration=1.8){ui.message.textContent=text;ui.message.classList.add('show');noticeTimer=duration;}
  function toast(text,duration=2.1){ui.toast.textContent=text;ui.toast.classList.add('show');toastTimer=duration;}
  function addScore(points){const before=score;score+=Math.max(0,Math.floor(points*scoreMultiplier()*DIFFICULTIES[selectedDifficulty].score));const amount=score-before;if(amount>0){ui.scoreGain.textContent=`+${amount}`;ui.scoreGain.classList.add('show');scoreGainTimer=.72;}}
  function scoreMultiplier(){return Math.min(5,1+Math.floor(combo/5)*.5)*(doubleTimer>0?2:1);}
  function ensureAudio(){if(!settings.soundEnabled||mutedByKey)return;const Ctx=window.AudioContext||window.webkitAudioContext;if(!audioContext&&Ctx)audioContext=new Ctx();if(audioContext&&audioContext.state==='suspended')audioContext.resume();}
  function tone(freq,duration=.12,wave='sine',volume=.04,endFreq=null){if(!settings.soundEnabled||mutedByKey||!audioContext)return;const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=wave;osc.frequency.setValueAtTime(freq,now);if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(1,endFreq),now+duration);gain.gain.setValueAtTime(volume*settings.masterVolume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+duration);}
  function sfx(name){if(!settings.soundEnabled||mutedByKey||(!settings.uiSounds&&(name==='level'||name==='mission')))return;const sounds={jump:()=>tone(270,.14,'square',.05,560),double:()=>tone(450,.16,'triangle',.05,880),dash:()=>tone(180,.2,'sawtooth',.06,900),shoot:()=>tone(760,.07,'square',.025,220),reload:()=>{tone(260,.09,'square',.035);setTimeout(()=>tone(460,.11,'square',.03),140);},land:()=>tone(100,.07,'sine',.04,55),coin:()=>tone(980,.1,'square',.04,1500),power:()=>tone(420,.25,'triangle',.05,1250),hit:()=>tone(145,.28,'sawtooth',.06,42),boss:()=>tone(90,.42,'sawtooth',.065,34),level:()=>{tone(520,.14,'triangle',.04);setTimeout(()=>tone(790,.17,'triangle',.045),110);},mission:()=>{tone(620,.12,'triangle',.04);setTimeout(()=>tone(950,.17,'triangle',.045),120);}};sounds[name]?.();}
  function burst(position,color,count=12,power=4){if(!settings.particlesEnabled)return;for(let i=0;i<count&&arrays.particles.length<CONFIG.maxParticles;i++){const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95});const p=new THREE.Mesh(sharedParticleGeometry,material);p.position.copy(position);p.scale.setScalar(rand(.45,1));p.userData.velocity=new THREE.Vector3(rand(-power/2,power/2),rand(0,power),rand(-power/2,power/2));p.userData.life=rand(.35,.85);p.userData.maxLife=p.userData.life;scene.add(p);arrays.particles.push(p);}}
  function updateParticles(dt){for(let i=arrays.particles.length-1;i>=0;i--){const p=arrays.particles[i];p.userData.life-=dt;p.userData.velocity.y-=9*dt;p.position.addScaledVector(p.userData.velocity,dt);p.material.opacity=Math.max(0,p.userData.life/p.userData.maxLife);p.scale.multiplyScalar(.985);if(p.userData.life<=0){disposeMesh(p);arrays.particles.splice(i,1);}}}

  // ---------------------------------------------------------------------------
  // Themes, scenery and settings application
  // ---------------------------------------------------------------------------
  function theme(){return STAGES[(currentStage-1)%STAGES.length];}
  function buildScenery(){
    while(sceneryGroup.children.length){const object=sceneryGroup.children[0];sceneryGroup.remove(object);object.geometry?.dispose();if(Array.isArray(object.material))object.material.forEach(m=>m.dispose());else object.material?.dispose();}
    const variant=(currentStage-1)%STAGES.length;
    const factories=[()=>new THREE.ConeGeometry(1,1,5),()=>new THREE.CylinderGeometry(.2,1,1,7),()=>new THREE.BoxGeometry(1,1,1),()=>new THREE.OctahedronGeometry(.8),()=>new THREE.IcosahedronGeometry(.8),()=>new THREE.DodecahedronGeometry(.8)];
    for(let z=-80;z<=50;z+=variant%3===0?12:9){for(const side of [-1,1]){const h=rand(3,variant%4===2?13:10),g=factories[variant%factories.length](),m=new THREE.MeshStandardMaterial({color:variant%2?'#1c3850':'#172d49',roughness:.48,metalness:.34,emissive:theme().glow,emissiveIntensity:.1});const obj=new THREE.Mesh(g,m);obj.scale.set(rand(1,1.55),h,rand(1,1.55));obj.position.set(side*rand(10,13),groundTop+h/2,z+rand(-2,2));obj.rotation.y=rand(0,Math.PI);obj.castShadow=settings.shadowsEnabled&&settings.quality==='high';sceneryGroup.add(obj);}}
    for(let i=0;i<10;i++){let g;if(variant%4===0)g=new THREE.TorusGeometry(rand(1,1.7),.045,8,30);else if(variant%4===1)g=new THREE.OctahedronGeometry(rand(.8,1.4));else if(variant%4===2)g=new THREE.BoxGeometry(1.4,1.4,1.4);else g=new THREE.IcosahedronGeometry(rand(.8,1.3),1);const m=new THREE.MeshBasicMaterial({color:theme().glow,transparent:true,opacity:.28,wireframe:variant%4!==2});const obj=new THREE.Mesh(g,m);obj.position.set((i%2?1:-1)*rand(9.5,12),rand(1,6),-73+i*15);if(variant%4===0)obj.rotation.y=Math.PI/2;sceneryGroup.add(obj);}
  }
  function applyTheme(){const t=theme();scene.background.set(t.sky);scene.fog.color.set(t.fog);scene.fog.near=settings.fogEnabled?80:500;scene.fog.far=settings.fogEnabled?175:700;groundMaterial.color.set(t.floor);rails.forEach(r=>{r.material.color.set(t.glow);r.material.emissive.set(t.glow);});rimLight.color.set(t.glow);playerRing.material.color.set(t.glow);ui.biome.textContent=t.name.toUpperCase();ui.stage.textContent=String(currentStage).padStart(2,'0');buildScenery();}
  function applySettings(){
    const ratio=settings.quality==='high'?1.8:settings.quality==='low'?1:1.35;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,ratio));renderer.shadowMap.enabled=settings.shadowsEnabled&&settings.quality!=='low';keyLight.castShadow=renderer.shadowMap.enabled;
    ambient.intensity=settings.glowEnabled?1.35:1.05;rimLight.intensity=settings.glowEnabled?1.5:.25;
    scene.fog.near=settings.fogEnabled?80:500;scene.fog.far=settings.fogEnabled?175:700;stars.visible=settings.starsEnabled;
    camera.fov=settings.fov;camera.updateProjectionMatrix();
    playerMaterial.color.set(settings.playerColor);playerMaterial.emissive.set(settings.playerColor);playerRing.material.color.set(settings.trailColor);
    ui.radar.classList.toggle('hidden',!settings.radarEnabled);ui.fps.style.display=settings.fpsEnabled?'block':'none';
    ui.hud.style.setProperty('--hud-scale',String(settings.hudScale/100));
    document.body.classList.toggle('high-contrast',!!settings.highContrast);
    updatePlayerGeometry();saveSettings();
  }

  // ---------------------------------------------------------------------------
  // Profile, missions, achievements and customization
  // ---------------------------------------------------------------------------
  function unlockAchievement(id){if(profile.achievements.includes(id))return;profile.achievements.push(id);const item=ACHIEVEMENTS.find(a=>a[0]===id);if(item){toast(`ACHIEVEMENT UNLOCKED · ${item[1].toUpperCase()}`,3);sfx('mission');}saveProfile();}
  function checkAchievements(){
    if(profile.totalRuns>=1)unlockAchievement('first_run');if(profile.totalCoins>=25)unlockAchievement('coin_25');if(profile.totalCoins>=100)unlockAchievement('coin_100');
    if(score>=1000)unlockAchievement('score_1000');if(score>=5000)unlockAchievement('score_5000');if(profile.totalKills>=25)unlockAchievement('kills_25');if(profile.totalKills>=100)unlockAchievement('kills_100');
    if(profile.totalDodges>=25)unlockAchievement('dodge_25');if(bestCombo>=10)unlockAchievement('combo_10');if(profile.bossesDefeated>=1)unlockAchievement('boss_1');
    if(currentStage>=5)unlockAchievement('stage_5');if(currentStage>=12)unlockAchievement('stage_12');if(profile.unlockedSkins.length>=5)unlockAchievement('skin_5');
    if(profile.totalPowerups>=20)unlockAchievement('power_20');if(activeMode==='rush'&&totalElapsed>=60)unlockAchievement('rush_60');if(profile.totalDashes>=20)unlockAchievement('dash_20');if(profile.totalJumps>=50)unlockAchievement('jump_50');
  }
  function renderAchievements(){ui.achievementGrid.innerHTML='';for(const [id,title,description] of ACHIEVEMENTS){const unlocked=profile.achievements.includes(id);const card=document.createElement('article');card.className=`achievement-card${unlocked?' unlocked':''}`;card.innerHTML=`<strong>${unlocked?'✦':'◇'} ${title.toUpperCase()}</strong><p>${description}</p><small>${unlocked?'UNLOCKED':'NOT YET EARNED'}</small>`;ui.achievementGrid.appendChild(card);}}
  function renderGarage(){ui.skinGrid.innerHTML='';SKINS.forEach((skin,index)=>{const owned=profile.unlockedSkins.includes(index),button=document.createElement('button');button.className=`skin-card${selectedSkin===index?' selected':''}`;button.type='button';button.innerHTML=`<i class="skin-swatch" style="color:${skin.color};background:${skin.color}"></i><strong>${skin.name.toUpperCase()}</strong><small>${owned?'OWNED':`${skin.price} ◆`}</small>`;button.addEventListener('click',()=>{selectedSkin=index;ui.garageCube.style.background=skin.color;ui.garageCube.style.boxShadow=`0 0 45px ${skin.color}88`;ui.skinName.textContent=skin.name.toUpperCase();ui.skinDescription.textContent=skin.desc;ui.equipSkin.textContent=owned?(profile.skin===index?'EQUIPPED':'EQUIP STYLE'):`UNLOCK · ${skin.price} ◆`;ui.equipSkin.disabled=profile.skin===index;renderGarageGridSelection();});ui.skinGrid.appendChild(button);});updateGaragePreview();}
  function renderGarageGridSelection(){[...ui.skinGrid.children].forEach((el,i)=>el.classList.toggle('selected',i===selectedSkin));}
  function updateGaragePreview(){const skin=SKINS[selectedSkin]||SKINS[0];ui.garageCube.style.background=skin.color;ui.garageCube.style.boxShadow=`0 0 45px ${skin.color}88`;ui.skinName.textContent=skin.name.toUpperCase();ui.skinDescription.textContent=skin.desc;ui.garageWallet.textContent=fmt(profile.wallet);ui.equipSkin.disabled=profile.skin===selectedSkin;ui.equipSkin.textContent=profile.unlockedSkins.includes(selectedSkin)?(profile.skin===selectedSkin?'EQUIPPED':'EQUIP STYLE'):`UNLOCK · ${skin.price} ◆`;}
  ui.equipSkin.addEventListener('click',()=>{const skin=SKINS[selectedSkin];if(!profile.unlockedSkins.includes(selectedSkin)){if(profile.wallet<skin.price){toast('NOT ENOUGH COINS');return;}profile.wallet-=skin.price;profile.unlockedSkins.push(selectedSkin);toast('NEW STYLE UNLOCKED');}profile.skin=selectedSkin;settings.playerColor=skin.color;applySettings();saveProfile();checkAchievements();renderGarage();});
  function setMission(){if(activeMode==='free'){mission=null;ui.missionCard.classList.add('hidden');return;}ui.missionCard.classList.remove('hidden');mission=MISSIONS[(currentStage-1)%MISSIONS.length];missionProgress=0;missionComplete=false;ui.mission.textContent=mission.title;ui.missionReward.textContent=`+${mission.reward}`;ui.missionProgress.textContent=`0 / ${mission.target} complete`;ui.missionFill.style.width='0%';}
  function missionUpdate(type,amount=1){if(!mission||missionComplete||mission.type!==type)return;missionProgress=Math.min(mission.target,missionProgress+amount);ui.missionFill.style.width=`${missionProgress/mission.target*100}%`;ui.missionProgress.textContent=`${missionProgress} / ${mission.target} complete`;if(missionProgress>=mission.target){missionComplete=true;score+=mission.reward;profile.wallet+=Math.max(2,Math.floor(mission.reward/40));toast(`OBJECTIVE COMPLETE · +${mission.reward} SCORE`);notice('MISSION COMPLETE',2);sfx('mission');saveProfile();}}
  function equipSkinColor(){const color=SKINS[profile.skin].color;settings.playerColor=color;playerMaterial.color.set(color);playerMaterial.emissive.set(color);}
  function cycleSkin(){const owned=profile.unlockedSkins;const current=owned.indexOf(profile.skin);profile.skin=owned[(current+1)%owned.length];selectedSkin=profile.skin;settings.playerColor=SKINS[profile.skin].color;playerMaterial.color.set(settings.playerColor);playerMaterial.emissive.set(settings.playerColor);saveProfile();saveSettings();toast(`EQUIPPED · ${SKINS[profile.skin].name.toUpperCase()}`);}

  // ---------------------------------------------------------------------------
  // Settings interface: build all settings from one schema
  // ---------------------------------------------------------------------------
  function buildSettingsUI(){
    ui.settingsMount.innerHTML='';
    for(const group of SETTING_GROUPS){const section=document.createElement('section');section.className='settings-group';const heading=document.createElement('h3');heading.textContent=group.title;section.appendChild(heading);
      for(const item of group.items){const [key,type,label,help,...extra]=item;const row=document.createElement('label');row.className='setting-row';const text=document.createElement('span');text.innerHTML=`${label}<small>${help}</small>`;row.appendChild(text);let control;
        if(type==='toggle'){control=document.createElement('input');control.type='checkbox';control.checked=!!settings[key];}
        else if(type==='range'){control=document.createElement('input');control.type='range';control.min=extra[0];control.max=extra[1];control.step=extra[2];control.value=settings[key];const output=document.createElement('output');output.textContent=String(settings[key]);row.appendChild(output);control.addEventListener('input',()=>{settings[key]=Number(control.value);output.textContent=Number(control.value).toFixed(key==='masterVolume'||key==='airControl'||key==='mouseSensitivity'||key==='dashCooldown'?2:1).replace(/\.0$/,'');applySettings();});}
        else if(type==='color'){control=document.createElement('input');control.type='color';control.value=settings[key];}
        else{control=document.createElement('select');for(const [value,name] of extra[0]){const option=document.createElement('option');option.value=value;option.textContent=name;control.appendChild(option);}control.value=settings[key];}
        if(type!=='range')control.addEventListener('change',()=>{settings[key]=type==='toggle'?control.checked:control.value;if(key==='cameraMode'){firstPerson=settings.cameraMode==='first';ui.crosshair.classList.toggle('active',firstPerson);}applySettings();});
        row.appendChild(control);section.appendChild(row);
      }
      ui.settingsMount.appendChild(section);
    }
  }
  $('resetSettings').addEventListener('click',()=>{settings={...DEFAULT_SETTINGS};buildSettingsUI();applySettings();toast('ALL SETTINGS RESTORED');});

  // ---------------------------------------------------------------------------
  // Player physics: acceleration, friction, air control, coyote time, buffering
  // ---------------------------------------------------------------------------
  function resetPlayer(){playerMesh.position.set(0,groundTop+PLAYER_SIZE.height/2,CONFIG.playerZ);playerVelocity.set(0,0,0);playerMesh.rotation.set(0,0,0);playerMesh.visible=true;playerRing.position.set(0,groundTop+.025,CONFIG.playerZ);jumpCount=0;wasGrounded=true;previouslyGrounded=true;coyoteTimer=0;jumpBuffer=0;dashTimer=0;dashCooldown=0;}
  function queueJump(){if(gameState==='playing')jumpBuffer=.15;}
  function performJump(){if(jumpBuffer<=0)return;if(wasGrounded||coyoteTimer>0){playerVelocity.y=settings.jumpPower;jumpCount=1;wasGrounded=false;coyoteTimer=0;jumpBuffer=0;jumpsThisRun++;sfx('jump');}else if(jumpCount===1){playerVelocity.y=settings.jumpPower*.91;jumpCount=2;jumpBuffer=0;jumpsThisRun++;burst(playerMesh.position,settings.playerColor,9,3);sfx('double');}}
  function startDash(){if(gameState!=='playing'||dashCooldown>0)return;const ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+touchX+gamepadX;const iz=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+touchZ+gamepadZ;const len=Math.hypot(ix,iz);dashDirection.set(len>.05?ix/len:0,len>.05?iz/len:-1);dashTimer=.23;dashCooldown=settings.dashCooldown;invulnerabilityTimer=Math.max(invulnerabilityTimer,.28);dashesThisRun++;sfx('dash');}
  function updatePlayer(dt){
    const left=keys.KeyA||keys.ArrowLeft?1:0,right=keys.KeyD||keys.ArrowRight?1:0,up=keys.KeyW||keys.ArrowUp?1:0,down=keys.KeyS||keys.ArrowDown?1:0;
    let ix=clamp(right-left+touchX+gamepadX,-1,1),iz=clamp(down-up+(settings.invertY?-gamepadZ:gamepadZ)+(settings.invertY?-touchZ:touchZ),-1,1);const len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;}
    if(dashTimer>0){dashTimer=Math.max(0,dashTimer-dt);playerVelocity.x=dashDirection.x*settings.dashPower;playerVelocity.z=dashDirection.y*settings.dashPower;if(settings.trailsEnabled&&Math.random()<.7)makeTrail();}
    else{const grounded=wasGrounded;const maxSpeed=settings.moveSpeed*(grounded?1:settings.airControl);const response=len>.02?(grounded?13:5.5): (grounded?8:1.5);playerVelocity.x+=(ix*maxSpeed-playerVelocity.x)*smooth(response,dt);playerVelocity.z+=(iz*maxSpeed*.82-playerVelocity.z)*smooth(response,dt);}
    playerMesh.position.x+=playerVelocity.x*dt;playerMesh.position.z+=playerVelocity.z*dt;
    const halfWidth=Math.max(3.9,(clamp(settings.trackWidth-(currentStage-1)*.14,9,18))/2)-.6;
    playerMesh.position.x=clamp(playerMesh.position.x,-halfWidth,halfWidth);playerMesh.position.z=clamp(playerMesh.position.z,-15,23);
    const beforeBottom=playerMesh.position.y-PLAYER_SIZE.height/2;playerVelocity.y-=settings.gravity*dt;playerMesh.position.y+=playerVelocity.y*dt;
    const inX=Math.abs(playerMesh.position.x)+PLAYER_SIZE.width/2<groundMesh.scale.x*CONFIG.worldWidth/2;
    const inZ=playerMesh.position.z>CONFIG.groundZ-CONFIG.worldDepth/2&&playerMesh.position.z<CONFIG.groundZ+CONFIG.worldDepth/2;
    const bottom=playerMesh.position.y-PLAYER_SIZE.height/2;wasGrounded=false;
    if(inX&&inZ&&playerVelocity.y<=0&&beforeBottom>=groundTop-.035&&bottom<=groundTop){playerMesh.position.y=groundTop+PLAYER_SIZE.height/2;playerVelocity.y=0;wasGrounded=true;}
    if(wasGrounded){jumpCount=0;coyoteTimer=.13;if(!previouslyGrounded)sfx('land');}else coyoteTimer=Math.max(0,coyoteTimer-dt);
    previouslyGrounded=wasGrounded;jumpBuffer=Math.max(0,jumpBuffer-dt);performJump();
    playerMesh.rotation.z+=( -playerVelocity.x*.034-playerMesh.rotation.z)*smooth(9,dt);playerMesh.rotation.x+=(playerVelocity.z*.018-playerMesh.rotation.x)*smooth(8,dt);
    playerRing.position.set(playerMesh.position.x,groundTop+.025,playerMesh.position.z);playerRing.material.opacity=shieldActive?.94:.55;
    playerMaterial.emissiveIntensity=shieldActive?.82:.28;playerMesh.visible=!firstPerson&&(invulnerabilityTimer<=0||Math.floor(totalElapsed*14)%2===0);
    if(settings.trailsEnabled&&settings.trailStyle!=='off'&&Math.hypot(playerVelocity.x,playerVelocity.z)>7&&Math.random()<.16)makeTrail();
    if(playerMesh.position.y < -9){if(activeMode==='free')resetPlayer();else takeDamage(null,'You fell beyond the platform.');}
  }
  function makeTrail(){if(!settings.trailsEnabled||settings.trailStyle==='off'||arrays.trails.length>80)return;const geo=settings.trailStyle==='shards'?new THREE.TetrahedronGeometry(.12):settings.trailStyle==='dots'?new THREE.SphereGeometry(.09,7,6):new THREE.BoxGeometry(.13,.13,.13);const m=new THREE.MeshBasicMaterial({color:settings.trailColor,transparent:true,opacity:.65});const p=new THREE.Mesh(geo,m);p.position.copy(playerMesh.position);p.position.y-=.1;p.userData.life=.36;p.userData.maxLife=.36;scene.add(p);arrays.trails.push(p);}
  function updateTrails(dt){for(let i=arrays.trails.length-1;i>=0;i--){const p=arrays.trails[i];p.userData.life-=dt;p.material.opacity=.65*(p.userData.life/p.userData.maxLife);p.scale.multiplyScalar(.98);if(p.userData.life<=0){disposeMesh(p);arrays.trails.splice(i,1);}}}

  // ---------------------------------------------------------------------------
  // Enemy, pickup and projectile systems
  // ---------------------------------------------------------------------------
  function chooseEnemy(){const pool=['normal','normal','normal'];if(currentStage>=2)pool.push('runner');if(currentStage>=3)pool.push('heavy');if(currentStage>=4)pool.push('splitter');if(currentStage>=5)pool.push('zigzag');if(currentStage>=6)pool.push('prism');if(currentStage>=7)pool.push('hopper');return choice(pool);}
  function spawnEnemy(kind=chooseEnemy(),x=null,forcedSize=null){if(arrays.enemies.length>=CONFIG.maxEnemies)return null;const cfg=ENEMIES[kind];const size=forcedSize||cfg.size;const currentTrackWidth=clamp(settings.trackWidth-(currentStage-1)*.14,9,18);const half=(currentTrackWidth-size)/2-.35;const lane=x===null?choice([-4.6,0,4.6]):x;const posX=clamp(lane+(x===null?rand(-.35,.35):0),-half,half);let geometry=new THREE.BoxGeometry(size,size,size);if(kind==='prism')geometry=new THREE.OctahedronGeometry(size*.72);const material=new THREE.MeshStandardMaterial({color:cfg.color,roughness:.32,metalness:.35,emissive:cfg.color,emissiveIntensity:kind==='guardian'?.65:.2,transparent:kind==='prism',opacity:kind==='prism'?.78:1});const mesh=new THREE.Mesh(geometry,material);mesh.position.set(posX,groundTop+size/2,CONFIG.spawnZ);mesh.castShadow=settings.shadowsEnabled&&settings.quality!=='low';scene.add(mesh);const diff=DIFFICULTIES[selectedDifficulty];const enemy={mesh,kind,size,width:size,height:size,depth:size,hp:kind==='guardian'?cfg.hp+currentStage*2:Math.max(1,cfg.hp*diff.enemyHp),maxHp:kind==='guardian'?cfg.hp+currentStage*2:Math.max(1,cfg.hp*diff.enemyHp),age:0,phase:rand(0,Math.PI*2),passed:false,dashHit:false,velocity:new THREE.Vector3(0,0,(10+currentStage*.44)*diff.speed*cfg.speed)};if(kind==='guardian'){enemy.velocity.z*=.76;boss=enemy;}arrays.enemies.push(enemy);return enemy;}
  function spawnBarrier(){const safe=Math.floor(Math.random()*3);[-4.6,0,4.6].forEach((x,i)=>{if(i!==safe)spawnEnemy('normal',x,1.5);});toast('BARRIER FORMING · FIND THE OPEN LANE');}
  function spawnPickup(kind,x,z){if(arrays.pickups.length>=CONFIG.maxPickups)return;const coin=kind==='coin',size=coin?.52:.76,color=coin?'#ffd46a':POWER_COLORS[kind]||'#ffffff';const geometry=coin?new THREE.OctahedronGeometry(size*.72):new THREE.IcosahedronGeometry(size*.62);const material=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.65,metalness:.4,roughness:.22});const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,groundTop+size/2+.24,z);scene.add(mesh);arrays.pickups.push({mesh,kind,size,width:size,height:size,depth:size,age:rand(0,5),speed:(10+currentStage*.4)*.78});}
  function coinTrail(){const lane=choice([-4.5,0,4.5]);for(let i=0;i<5;i++)spawnPickup('coin',lane,CONFIG.spawnZ-i*2.1);}
  function spawnPower(){const kinds=['shield','slow','double','magnet','rapid','multi','repair'];if(lives<CONFIG.maxLives&&activeMode!=='free')kinds.push('life');spawnPickup(choice(kinds),choice([-4.5,0,4.5]),CONFIG.spawnZ);}
  function playerBox(){return{position:playerMesh.position,width:PLAYER_SIZE.width,height:PLAYER_SIZE.height,depth:PLAYER_SIZE.depth};}
  function overlaps(a,b){const ap=a.position||a.mesh.position,bp=b.position||b.mesh.position;const aw=a.width??a.size??1,ah=a.height??a.size??1,ad=a.depth??a.size??1,bw=b.width??b.size??1,bh=b.height??b.size??1,bd=b.depth??b.size??1;return Math.abs(ap.x-bp.x)<(aw+bw)/2&&Math.abs(ap.y-bp.y)<(ah+bh)/2&&Math.abs(ap.z-bp.z)<(ad+bd)/2;}

  function fire(){if(gameState!=='playing'||fireCooldown>0||reloadTimer>0)return;if(ammo<=0&&rapidTimer<=0){if(settings.autoReload)reload();return;}if(rapidTimer<=0)ammo--;shotsFired++;missionUpdate('shots');fireCooldown=rapidTimer>0?.085:.19;const targets=settings.aimAssist?arrays.enemies.filter(e=>e.mesh.position.z<playerMesh.position.z&&Math.abs(e.mesh.position.z-playerMesh.position.z)<42).sort((a,b)=>b.mesh.position.z-a.mesh.position.z):[];const target=targets[0];const aimX=target?clamp((target.mesh.position.x-playerMesh.position.x)*.12*settings.mouseSensitivity,-.32,.32):0;const count=multiTimer>0?3:1;for(let i=0;i<count;i++){if(arrays.bullets.length>=CONFIG.maxBullets)break;const offset=count===1?0:(i-1)*.24;const mesh=new THREE.Mesh(new THREE.BoxGeometry(.16,.16,.72),new THREE.MeshBasicMaterial({color:'#fff1a6'}));mesh.position.set(playerMesh.position.x+offset,playerMesh.position.y,playerMesh.position.z-1);mesh.rotation.y=aimX*.8;scene.add(mesh);arrays.bullets.push({mesh,width:.2,height:.2,depth:.75,vx:aimX*18+(count===1?0:offset*2),speed:-55});}sfx('shoot');if(ammo<=0&&rapidTimer<=0&&settings.autoReload)reload();}
  function reload(){if(gameState!=='playing'||reloadTimer>0||ammo===CONFIG.magazine)return;reloadTimer=1.05;sfx('reload');}
  function damageEnemy(enemy,amount=1){if(!enemy||!arrays.enemies.includes(enemy))return;enemy.hp-=amount;if(settings.showDamageNumbers)toast(`${enemy.kind.toUpperCase()} · ${Math.max(0,enemy.hp)} HP`,.45);burst(enemy.mesh.position,`#${enemy.mesh.material.color.getHexString()}`,4,2.5);if(enemy.hp<=0){const index=arrays.enemies.indexOf(enemy);if(index>=0)killEnemy(enemy,index,false);}}
  function killEnemy(enemy,index,fromExplosion){
    if(enemy.kind==='guardian'){boss=null;bossDefeated=true;profile.bossesDefeated++;notice('GUARDIAN DEFEATED',2.4);toast('SECTOR GUARDIAN CLEARED · BONUS +450');profile.wallet+=10;for(let i=0;i<8;i++)spawnPickup('coin',clamp(enemy.mesh.position.x+rand(-2.5,2.5),-5.5,5.5),enemy.mesh.position.z-i*1.3);unlockAchievement('boss_1');}
    if(enemy.kind==='splitter'&&!fromExplosion){spawnEnemy('runner',clamp(enemy.mesh.position.x-1.1,-5.4,5.4),.65);spawnEnemy('runner',clamp(enemy.mesh.position.x+1.1,-5.4,5.4),.65);}
    kills++;profile.totalKills++;combo++;bestCombo=Math.max(bestCombo,combo);addScore(ENEMIES[enemy.kind].score);missionUpdate('kills');if(combo===5)notice('KILL STREAK',1.2);if(combo===10)notice('DIMENSION DOMINATION',1.5);
    burst(enemy.mesh.position,`#${enemy.mesh.material.color.getHexString()}`,enemy.kind==='guardian'?58:16,enemy.kind==='guardian'?10:5);disposeMesh(enemy.mesh);arrays.enemies.splice(index,1);if(enemy.kind==='guardian')sfx('mission');else if(!fromExplosion)sfx('coin');
  }
  function updateBullets(dt){for(let i=arrays.bullets.length-1;i>=0;i--){const b=arrays.bullets[i];b.mesh.position.z+=b.speed*dt;b.mesh.position.x+=b.vx*dt;let hit=false;for(let j=arrays.enemies.length-1;j>=0;j--){const e=arrays.enemies[j];if(overlaps({position:b.mesh.position,width:b.width,height:b.height,depth:b.depth},e)){shotsHit++;damageEnemy(e,1);hit=true;break;}}if(hit||b.mesh.position.z<CONFIG.spawnZ-8){disposeMesh(b.mesh);arrays.bullets.splice(i,1);}}}
  function explodeBomb(enemy){burst(enemy.mesh.position,'#ffb06a',22,7);for(let i=arrays.enemies.length-1;i>=0;i--){const other=arrays.enemies[i];if(other!==enemy&&other.kind!=='guardian'&&other.mesh.position.distanceTo(enemy.mesh.position)<4.4)damageEnemy(other,2);}}
  function takeDamage(enemy,reason='An enemy cube reached you.'){
    if(gameState!=='playing')return;
    if(enemy){const index=arrays.enemies.indexOf(enemy);if(index>=0){if(enemy.kind==='guardian'){boss=null;bossDefeated=true;}if(enemy.kind==='splitter'){}burst(enemy.mesh.position,'#ff9b78',12,4);disposeMesh(enemy.mesh);arrays.enemies.splice(index,1);}}
    if(activeMode==='free'){resetPlayer();return;}
    if(shieldActive){shieldActive=false;invulnerabilityTimer=.8;toast('SHIELD MODULE ABSORBED THE IMPACT');sfx('power');return;}
    if(invulnerabilityTimer>0)return;
    lives--;combo=0;invulnerabilityTimer=1.6;cameraShakeTimer=settings.cameraShake?.45:0;cameraShakePower=.4;
    if(!settings.reduceFlashes)document.body.classList.add('damage-flash');setTimeout(()=>document.body.classList.remove('damage-flash'),95);sfx('hit');
    if(lives<=0){endRun(false,reason);return;}
    playerMesh.position.set(0,groundTop+PLAYER_SIZE.height/2,CONFIG.playerZ);playerVelocity.set(0,0,0);toast(`IMPACT · ${lives} ${lives===1?'LIFE':'LIVES'} LEFT`);
  }
  function collectPickup(item,index){const kind=item.kind;burst(item.mesh.position,kind==='coin'?'#ffd46a':POWER_COLORS[kind]||'#ffffff',12,3);
    if(kind==='coin'){runCoins++;profile.totalCoins++;profile.wallet++;addScore(8);missionUpdate('coins');sfx('coin');}
    else{powerupsThisRun++;profile.totalPowerups++;missionUpdate('power');sfx('power');if(kind==='shield')shieldActive=true;if(kind==='slow')slowTimer=8;if(kind==='double')doubleTimer=10;if(kind==='life')lives=Math.min(CONFIG.maxLives,lives+1);if(kind==='magnet')magnetTimer=12;if(kind==='rapid'){rapidTimer=10;ammo=CONFIG.magazine;reloadTimer=0;}if(kind==='multi')multiTimer=9;if(kind==='repair')lives=Math.min(CONFIG.maxLives,lives+1);toast(`${kind.toUpperCase()} MODULE ACTIVATED`);}
    disposeMesh(item.mesh);arrays.pickups.splice(index,1);if(runCoins%5===0||kind==='coin')saveProfile();
  }

  // ---------------------------------------------------------------------------
  // Bosses, enemies, pickup motion and collisions
  // ---------------------------------------------------------------------------
  function spawnBoss(){if(bossSpawned||activeMode==='free'||activeMode==='rush')return;bossSpawned=true;const guardian=spawnEnemy('guardian',0,3.6);if(guardian){guardian.hp=guardian.maxHp=ENEMIES.guardian.hp+currentStage*2;ui.bossPanel.classList.remove('hidden');notice('SECTOR GUARDIAN',2.2);sfx('boss');}}
  function updateEnemies(dt){const slow=slowTimer>0?.52:1;for(let i=arrays.enemies.length-1;i>=0;i--){const e=arrays.enemies[i];e.age+=dt*slow;
      if(e.kind==='zigzag'||e.kind==='guardian'){const range=(settings.trackWidth-e.size)/2-.5;e.mesh.position.x=clamp(Math.sin(e.age*(e.kind==='guardian'?1.1:2.8)+e.phase)*(e.kind==='guardian'?3.8:3.1),-range,range);}
      if(e.kind==='hopper')e.mesh.position.y=groundTop+e.size/2+Math.max(0,Math.sin(e.age*3.1)*1.55);
      if(e.kind==='prism')e.mesh.material.opacity=.5+Math.abs(Math.sin(e.age*2))*.4;
      e.mesh.position.z+=e.velocity.z*dt*slow;e.mesh.rotation.x+=dt*(e.kind==='guardian'?.5:1.1);e.mesh.rotation.y+=dt*(e.kind==='guardian'?.9:1.55);
      if(overlaps(playerBox(),e)){
        if(dashTimer>0&&e.kind!=='guardian'){if(!e.dashHit){e.dashHit=true;damageEnemy(e,1);}continue;}
        if(invulnerabilityTimer>0&&e.kind!=='guardian'){damageEnemy(e,1);continue;}
        const isBoss=e.kind==='guardian';takeDamage(e,isBoss?'The sector guardian breached your defence.':'An enemy cube reached you.');if(isBoss)toast('GUARDIAN BREACHED THE LINE');if(gameState!=='playing')return;continue;
      }
      if(!e.passed&&e.mesh.position.z>playerMesh.position.z+1.2){e.passed=true;if(e.kind!=='guardian'){dodged++;profile.totalDodges++;combo++;bestCombo=Math.max(bestCombo,combo);addScore(10);missionUpdate('dodge');}}
      if(e.mesh.position.z>32){if(e.kind==='guardian'){boss=null;bossDefeated=true;toast('GUARDIAN ESCAPED · SECTOR CLEAR');}disposeMesh(e.mesh);arrays.enemies.splice(i,1);}
    }}
  function updatePickups(dt){for(let i=arrays.pickups.length-1;i>=0;i--){const item=arrays.pickups[i];item.age+=dt;item.mesh.position.z+=item.speed*dt*(slowTimer>0?.52:1);item.mesh.rotation.x+=dt*1.5;item.mesh.rotation.y+=dt*2.1;item.mesh.position.y+=Math.sin(item.age*3)*dt*.24;if(magnetTimer>0&&item.mesh.position.distanceTo(playerMesh.position)<13){item.mesh.position.x+=(playerMesh.position.x-item.mesh.position.x)*smooth(6,dt);item.mesh.position.z+=(playerMesh.position.z-item.mesh.position.z)*smooth(3.5,dt);item.mesh.position.y+=(playerMesh.position.y-item.mesh.position.y)*smooth(2,dt);}if(overlaps(playerBox(),{position:item.mesh.position,width:item.width,height:item.height,depth:item.depth}))collectPickup(item,i);else if(item.mesh.position.z>32){disposeMesh(item.mesh);arrays.pickups.splice(i,1);}}}

  // ---------------------------------------------------------------------------
  // Modes and stage progression
  // ---------------------------------------------------------------------------
  function updateModeButtons(){const labels={campaign:'▶ START CAMPAIGN',endless:'∞ START ENDLESS',rush:'ϟ START TIME RUSH',free:'✧ ENTER FREEDOM'};$('continueButton').textContent=labels[selectedMode];ui.modeButtons.forEach(b=>b.classList.toggle('selected',b.dataset.mode===selectedMode));}
  function renderLevels(){ui.levelGrid.innerHTML='';STAGES.forEach((stage,index)=>{const number=index+1,unlocked=selectedMode==='free'||number<=profile.maxUnlocked,card=document.createElement('button');card.type='button';card.className=`level-card${number===selectedLevel?' selected':''}${unlocked?'':' locked'}`;card.disabled=!unlocked;card.innerHTML=`<span class="level-number">${String(number).padStart(2,'0')}</span><span class="lock">${unlocked?'↗':'⌑'}</span><strong>${stage.name.toUpperCase()}</strong><small>${number%4===0?'GUARDIAN SECTOR':'SURVIVAL SECTOR'}</small>`;card.addEventListener('click',()=>{selectedLevel=number;renderLevels();ui.levelHint.textContent=`SECTOR ${String(number).padStart(2,'0')} SELECTED · ${stage.name.toUpperCase()}`;ui.startSelected.disabled=false;});ui.levelGrid.appendChild(card);});ui.levelHint.textContent=`${profile.maxUnlocked} / ${CONFIG.maxStages} SECTORS UNLOCKED`;ui.startSelected.disabled=selectedMode!=='free'&&selectedMode!=='endless'&&selectedMode!=='rush'&&selectedLevel>profile.maxUnlocked;}
  function startGame(mode=selectedMode,startingStage=1){ensureAudio();activeMode=mode;selectedMode=mode;activeStartStage=mode==='campaign'?clamp(startingStage,1,profile.maxUnlocked):clamp(startingStage,1,CONFIG.maxStages);currentStage=activeStartStage;stageElapsed=0;totalElapsed=0;rushRemaining=CONFIG.rushDuration;score=0;runCoins=0;lives=mode==='free'?99:DIFFICULTIES[selectedDifficulty].lives;combo=0;bestCombo=0;kills=0;dodged=0;shotsFired=0;shotsHit=0;jumpsThisRun=0;dashesThisRun=0;powerupsThisRun=0;ammo=CONFIG.magazine;reloadTimer=0;fireCooldown=0;spawnTimer=.75;coinTimer=1.7;powerTimer=7;wallTimer=10;shieldActive=false;slowTimer=0;doubleTimer=0;magnetTimer=0;rapidTimer=0;multiTimer=0;invulnerabilityTimer=0;bossSpawned=false;bossDefeated=false;previousPadButtons={};mutedByKey=false;firstPerson=settings.cameraMode==='first';ui.crosshair.classList.toggle('active',firstPerson);clearRunObjects();resetPlayer();groundMesh.scale.x=1;applyTheme();setMission();ui.bossPanel.classList.add('hidden');gameState='playing';ui.hud.classList.remove('hidden');ui.overlay.classList.add('hidden');ui.touch.classList.toggle('hidden',!(navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches));ui.message.classList.remove('show');ui.modeLabel.textContent=mode.toUpperCase();updateHUD();notice(mode==='free'?'FREEDOM MODE':mode==='rush'?'TIME RUSH':'SECTOR '+String(currentStage).padStart(2,'0'),1.8);if(settings.showTutorialTips)setTimeout(()=>{if(gameState==='playing')toast('TIP · JUMP, THEN DASH TO CHANGE YOUR MOMENTUM');},1800);updateModeButtons();}
  function nextStage(){if(activeMode==='campaign'&&currentStage>=CONFIG.maxStages){profile.maxUnlocked=CONFIG.maxStages;unlockAchievement('stage_24');endRun(true,'All 24 sectors conquered. You mastered the dimension.');return;}currentStage++;stageElapsed=0;boss=null;bossSpawned=false;bossDefeated=false;spawnTimer=1.1;coinTimer=1.3;powerTimer=7;wallTimer=10;profile.maxUnlocked=Math.max(profile.maxUnlocked,Math.min(CONFIG.maxStages,currentStage));if(currentStage%5===0&&lives<CONFIG.maxLives&&activeMode!=='free')lives++;clearList(arrays.enemies);clearList(arrays.pickups);clearList(arrays.bullets);groundMesh.scale.x=1;applyTheme();setMission();sfx('level');notice(`SECTOR ${String(currentStage).padStart(2,'0')} · ${theme().name.toUpperCase()}`,2.3);saveProfile();}
  function updateGame(dt){
    totalElapsed+=dt;if(activeMode!=='free')stageElapsed+=dt;if(activeMode==='rush'){rushRemaining-=dt;if(rushRemaining<=0){endRun(true,'The Time Rush clock expired. Your score is locked in.');return;}}
    if(activeMode!=='free'&&activeMode!=='rush')score+=dt*5*scoreMultiplier();else if(activeMode==='free')score+=dt;
    invulnerabilityTimer=Math.max(0,invulnerabilityTimer-dt);dashCooldown=Math.max(0,dashCooldown-dt);slowTimer=Math.max(0,slowTimer-dt);doubleTimer=Math.max(0,doubleTimer-dt);magnetTimer=Math.max(0,magnetTimer-dt);rapidTimer=Math.max(0,rapidTimer-dt);multiTimer=Math.max(0,multiTimer-dt);fireCooldown=Math.max(0,fireCooldown-dt);
    if(reloadTimer>0){reloadTimer-=dt;if(reloadTimer<=0)ammo=CONFIG.magazine;}
    if(scoreGainTimer>0){scoreGainTimer-=dt;if(scoreGainTimer<=0)ui.scoreGain.classList.remove('show');}
    pollGamepad();updatePlayer(dt);if(touchShoot||mouseShoot||gamepadShoot||(settings.autoFire&&keys.KeyF))fire();
    const platformRatio=clamp(settings.trackWidth-(currentStage-1)*.14,9,18)/CONFIG.worldWidth;groundMesh.scale.x+=(platformRatio-groundMesh.scale.x)*smooth(1.4,dt);rails.forEach((rail,index)=>{rail.position.x=(index===0?-1:1)*(CONFIG.worldWidth*groundMesh.scale.x/2+.08);});
    if(activeMode!=='free'){
      spawnTimer-=dt;if(spawnTimer<=0){spawnEnemy();if(currentStage>=6&&Math.random()<.24)spawnEnemy('runner');spawnTimer=Math.max(.42,1.45-currentStage*.035)*DIFFICULTIES[selectedDifficulty].spawn;}
      coinTimer-=dt;if(coinTimer<=0){coinTrail();coinTimer=activeMode==='rush'?3.4:4.2+Math.random()*2.2;}
      powerTimer-=dt;if(powerTimer<=0){spawnPower();powerTimer=12+Math.random()*5;}
      wallTimer-=dt;if(currentStage>=4&&wallTimer<=0){spawnBarrier();wallTimer=Math.max(8,17-currentStage*.25);}
      if(activeMode!=='rush'&&currentStage%4===0&&stageElapsed>3.8&&!bossSpawned)spawnBoss();
    }else{coinTimer-=dt;if(coinTimer<=0){coinTrail();coinTimer=3.2;}}
    updateBullets(dt);updateEnemies(dt);updatePickups(dt);updateParticles(dt);updateTrails(dt);
    if(activeMode==='rush'&&totalElapsed>=60)unlockAchievement('rush_60');
    if(activeMode!=='free'&&activeMode!=='rush'&&stageElapsed>=CONFIG.stageDuration&&(currentStage%4!==0||bossDefeated))nextStage();
    updateHUD();
  }

  // ---------------------------------------------------------------------------
  // HUD, radar, camera, FPS and input
  // ---------------------------------------------------------------------------
  function updateHUD(){ui.score.textContent=fmt(score).padStart(6,'0');ui.best.textContent=fmt(profile.best).padStart(6,'0');ui.stage.textContent=String(currentStage).padStart(2,'0');ui.lives.textContent=activeMode==='free'?'∞':Array(Math.max(0,lives)).fill('♥').join(' ');ui.coins.textContent=`${runCoins} COINS`;ui.combo.textContent=`COMBO ×${scoreMultiplier().toFixed(1)}`;ui.speed.textContent=`${Math.round(Math.hypot(playerVelocity.x,playerVelocity.z)*7.2)} KM/H`;ui.ammo.textContent=reloadTimer>0?'RELOADING…':rapidTimer>0?'RAPID FIRE':`${ammo} / ${CONFIG.magazine}`;const powers=[];if(shieldActive)powers.push('SHIELD');if(slowTimer>0)powers.push(`SLOW ${Math.ceil(slowTimer)}s`);if(doubleTimer>0)powers.push(`SCORE ×2 ${Math.ceil(doubleTimer)}s`);if(magnetTimer>0)powers.push(`MAGNET ${Math.ceil(magnetTimer)}s`);if(rapidTimer>0)powers.push(`RAPID ${Math.ceil(rapidTimer)}s`);if(multiTimer>0)powers.push(`TRIPLE ${Math.ceil(multiTimer)}s`);powers.push(dashCooldown>0?`DASH ${dashCooldown.toFixed(1)}s`:'DASH READY');ui.power.textContent=powers.join(' / ');ui.progress.style.width=activeMode==='free'?'0%':activeMode==='rush'?`${clamp(totalElapsed/CONFIG.rushDuration*100,0,100)}%`:`${clamp(stageElapsed/CONFIG.stageDuration*100,0,100)}%`;ui.bossPanel.classList.toggle('hidden',!boss);if(boss){const hp=clamp(boss.hp/boss.maxHp*100,0,100);ui.bossFill.style.width=`${hp}%`;ui.bossText.textContent=`${Math.ceil(hp)}%`;}ui.radar.classList.toggle('hidden',!settings.radarEnabled);const lane=playerMesh.position.x<-1.5?'left':playerMesh.position.x>1.5?'right':'';ui.radarPlayer.className=lane;const threat=arrays.enemies.filter(e=>e.mesh.position.z<playerMesh.position.z).sort((a,b)=>b.mesh.position.z-a.mesh.position.z)[0];ui.radarText.textContent=threat?`${threat.kind.toUpperCase()} · ${Math.round(Math.abs(playerMesh.position.z-threat.mesh.position.z))}M`:'CLEAR AHEAD';ui.fps.style.display=settings.fpsEnabled?'block':'none';}
  function updateCamera(dt){const mode=firstPerson?'first':(settings.cameraMode==='close'?'close':'chase');const distance=settings.cameraDistance;if(mode==='first'){cameraDesired.set(playerMesh.position.x,playerMesh.position.y+.5,playerMesh.position.z+.25);lookTarget.set(playerMesh.position.x,playerMesh.position.y+.28,playerMesh.position.z-25);playerMesh.visible=false;}else{const d=mode==='close'?distance*.72:distance;cameraDesired.set(playerMesh.position.x*.38,playerMesh.position.y+d*.34,playerMesh.position.z+d);lookTarget.set(playerMesh.position.x*.2,groundTop+.8,playerMesh.position.z-d*.46);}camera.position.lerp(cameraDesired,smooth(mode==='first'?15:4.2,dt));camera.lookAt(lookTarget);if(cameraShakeTimer>0&&settings.cameraShake){const p=cameraShakePower*(cameraShakeTimer/.45);camera.position.x+=rand(-p,p);camera.position.y+=rand(-p,p);}}
  function updateWorld(dt){const speed=gameState==='playing'?3.1+currentStage*.2:1.1;for(let i=0;i<STAR_COUNT;i++){starPositions[i*3+2]+=speed*dt;if(starPositions[i*3+2]>68)starPositions[i*3+2]=-98;}starGeometry.attributes.position.needsUpdate=true;sceneryGroup.children.forEach((obj,i)=>{if(obj.geometry?.type==='TorusGeometry')obj.rotation.z+=dt*(i%2?.18:-.15);});if(cameraShakeTimer>0)cameraShakeTimer=Math.max(0,cameraShakeTimer-dt);updateCamera(dt);fpsFrames++;fpsElapsed+=dt;if(fpsElapsed>=.5){currentFPS=Math.round(fpsFrames/fpsElapsed);ui.fps.textContent=`${currentFPS} FPS`;fpsFrames=0;fpsElapsed=0;}}
  function pollGamepad(){const pads=navigator.getGamepads?navigator.getGamepads():[];const pad=pads&&pads[0];gamepadX=0;gamepadZ=0;gamepadShoot=false;if(!pad)return;const ax=pad.axes[0]||0,ay=pad.axes[1]||0;if(Math.abs(ax)>.18)gamepadX=ax;if(Math.abs(ay)>.18)gamepadZ=ay;const jump=!!pad.buttons[0]?.pressed,dash=!!pad.buttons[1]?.pressed;gamepadShoot=!!pad.buttons[7]?.pressed;if(jump&&!previousPadButtons.jump)queueJump();if(dash&&!previousPadButtons.dash)startDash();previousPadButtons={jump,dash};}
  function toggleCamera(){firstPerson=!firstPerson;ui.crosshair.classList.toggle('active',firstPerson);toast(firstPerson?'FIRST-PERSON VIEW':'CHASE VIEW');}
  function toggleMute(){mutedByKey=!mutedByKey;if(!mutedByKey)ensureAudio();toast(mutedByKey?'AUDIO MUTED':'AUDIO ENABLED');}

  // ---------------------------------------------------------------------------
  // Screen flow, run summary and persistence
  // ---------------------------------------------------------------------------
  const SCREENS=['homeScreen','levelScreen','settingsScreen','garageScreen','achievementsScreen','controlsScreen','pauseScreen','resultScreen'];
  function showScreen(id){SCREENS.forEach(name=>$(name).classList.toggle('active',name===id));}
  function pauseGame(){if(gameState==='playing'){gameState='paused';touchShoot=false;mouseShoot=false;showScreen('pauseScreen');ui.overlay.classList.remove('hidden');ui.touch.classList.add('hidden');}else if(gameState==='paused'){gameState='playing';ui.overlay.classList.add('hidden');ui.touch.classList.toggle('hidden',!(navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches));}}
  function endRun(victory,message){if(gameState==='over')return;gameState='over';touchShoot=false;mouseShoot=false;profile.best=Math.max(profile.best,Math.floor(score));profile.totalRuns++;profile.totalJumps+=jumpsThisRun;profile.totalDashes+=dashesThisRun;profile.history.unshift({score:Math.floor(score),mode:activeMode,stage:currentStage,coins:runCoins,date:new Date().toISOString()});profile.history=profile.history.slice(0,12);checkAchievements();saveProfile();ui.hud.classList.add('hidden');ui.touch.classList.add('hidden');ui.bossPanel.classList.add('hidden');$('resultTitle').innerHTML=victory?'DIMENSION <em>CONQUERED.</em>':'RUN <em>ENDED.</em>';$('resultMessage').textContent=message;$('resultScore').textContent=fmt(score);$('resultCoins').textContent=fmt(runCoins);$('resultKills').textContent=fmt(kills);$('resultCombo').textContent=`×${bestCombo}`;$('resultRetry').textContent=victory?'↻ PLAY AGAIN':'↻ RETRY RUN';showScreen('resultScreen');ui.overlay.classList.remove('hidden');sfx('mission');}
  function returnToMenu(){gameState='menu';ui.hud.classList.add('hidden');ui.touch.classList.add('hidden');ui.overlay.classList.remove('hidden');renderLevels();updateProfileUI();showScreen('homeScreen');}

  // ---------------------------------------------------------------------------
  // Navigation and settings screens
  // ---------------------------------------------------------------------------
  ui.modeButtons.forEach(button=>button.addEventListener('click',()=>{selectedMode=button.dataset.mode;updateModeButtons();renderLevels();}));
  ui.difficulty.addEventListener('change',()=>{selectedDifficulty=ui.difficulty.value;});
  $('continueButton').addEventListener('click',()=>startGame(selectedMode,selectedMode==='campaign'?selectedLevel:1));
  $('levelButton').addEventListener('click',()=>{renderLevels();showScreen('levelScreen');});
  $('startSelected').addEventListener('click',()=>startGame(selectedMode,selectedLevel));
  $('settingsButton').addEventListener('click',()=>{buildSettingsUI();showScreen('settingsScreen');});
  $('controlsButton').addEventListener('click',()=>showScreen('controlsScreen'));
  $('garageButton')?.addEventListener('click',()=>{selectedSkin=profile.skin;renderGarage();showScreen('garageScreen');});
  $('achievementsButton')?.addEventListener('click',()=>{renderAchievements();showScreen('achievementsScreen');});
  document.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>showScreen(button.dataset.back)));
  $('pauseButton').addEventListener('click',pauseGame);$('resumeButton').addEventListener('click',pauseGame);
  $('restartButton').addEventListener('click',()=>startGame(activeMode,activeStartStage));$('quitButton').addEventListener('click',returnToMenu);
  $('resultRetry').addEventListener('click',()=>startGame(activeMode,activeStartStage));$('resultMenu').addEventListener('click',returnToMenu);

  // ---------------------------------------------------------------------------
  // Keyboard, pointer, touch and gamepad bindings
  // ---------------------------------------------------------------------------
  window.addEventListener('keydown',event=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code))event.preventDefault();if(event.repeat)return;keys[event.code]=true;if(event.code==='Space')queueJump();if(event.code==='KeyF'&&!settings.autoFire)fire();if(event.code==='ShiftLeft'||event.code==='ShiftRight')startDash();if(event.code==='KeyQ')reload();if(event.code==='KeyC'&&gameState==='playing')toggleCamera();if(event.code==='KeyM')toggleMute();if(event.code==='KeyP'||event.code==='Escape'){if(gameState==='playing'||gameState==='paused')pauseGame();else if(gameState==='menu')returnToMenu();}if(event.code==='KeyR'&&(gameState==='playing'||gameState==='over'))startGame(activeMode,activeStartStage);if(event.code==='F3'){settings.fpsEnabled=!settings.fpsEnabled;ui.fps.style.display=settings.fpsEnabled?'block':'none';saveSettings();}if(event.code==='KeyK'&&gameState!=='playing')cycleSkin();if(event.code==='Enter'&&gameState==='menu'&&$('homeScreen').classList.contains('active'))startGame(selectedMode,selectedLevel);});
  window.addEventListener('keyup',event=>{keys[event.code]=false;if(event.code==='Space'&&playerVelocity.y>0)playerVelocity.y*=.55;});
  window.addEventListener('blur',()=>{Object.keys(keys).forEach(key=>keys[key]=false);touchShoot=false;mouseShoot=false;if(gameState==='playing')pauseGame();});
  renderer.domElement.addEventListener('pointerdown',event=>{if(event.button===0&&gameState==='playing'){mouseShoot=true;fire();}});
  window.addEventListener('pointerup',()=>{mouseShoot=false;});window.addEventListener('contextmenu',event=>event.preventDefault());
  document.querySelectorAll('[data-hold]').forEach(button=>{const val=button.dataset.hold==='left'?-1:1;button.addEventListener('pointerdown',event=>{event.preventDefault();touchX=val;});['pointerup','pointercancel','pointerleave'].forEach(name=>button.addEventListener(name,()=>{touchX=0;}));});
  document.querySelectorAll('[data-action]').forEach(button=>{const action=button.dataset.action;if(action==='jump')button.addEventListener('pointerdown',event=>{event.preventDefault();queueJump();});if(action==='dash')button.addEventListener('pointerdown',event=>{event.preventDefault();startDash();});if(action==='shoot'){button.addEventListener('pointerdown',event=>{event.preventDefault();touchShoot=true;fire();});['pointerup','pointercancel','pointerleave'].forEach(name=>button.addEventListener(name,()=>touchShoot=false));}});

  // ---------------------------------------------------------------------------
  // Resize, animation loop and startup
  // ---------------------------------------------------------------------------
  function onResize(){const width=innerWidth,height=Math.max(1,innerHeight);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);}
  window.addEventListener('resize',onResize);
  function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.045);if(gameState==='playing')updateGame(dt);else{if(arrays.particles.length)updateParticles(dt);if(arrays.trails.length)updateTrails(dt);}if(noticeTimer>0){noticeTimer-=dt;if(noticeTimer<=0)ui.message.classList.remove('show');}if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show');}updateWorld(dt);renderer.render(scene,camera);}

  // Initial boot
  selectedDifficulty='normal';ui.difficulty.value=selectedDifficulty;selectedLevel=profile.maxUnlocked;equipSkinColor();buildSettingsUI();applySettings();renderLevels();renderGarage();renderAchievements();updateModeButtons();applyTheme();showScreen('homeScreen');updateProfileUI();animate();
  setTimeout(()=>ui.loading.classList.add('done'),650);setTimeout(()=>{if(ui.loading.parentNode)ui.loading.remove();},1200);
})();
