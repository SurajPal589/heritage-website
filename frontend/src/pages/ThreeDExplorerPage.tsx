import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Box, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Info, 
  Eye, 
  Sliders,
  Compass
} from 'lucide-react';

interface MonumentModelInfo {
  id: string;
  name: string;
  location: string;
  period: string;
  category: string;
  material: string;
  description: string;
  architecturalHighlights: string[];
}

const MONUMENT_MODELS: MonumentModelInfo[] = [
  {
    id: 'stepwell-pillar',
    name: 'Solanki Carved Stepwell Pavilion & Column',
    location: 'Rani ki Vav, Patan, Gujarat',
    period: '11th Century CE (Solanki Dynasty)',
    category: 'Stepwells & Water Architecture',
    material: 'Golden Sandstone with Intricate Chiseled Relief',
    description: 'A structural section of the subterranean pillared pavilion (mandapa) from Rani ki Vav. Demonstrates the load-bearing bracket capitals, fluted shaft, and multi-tiered decorative bands characteristic of Solanki stonemasonry.',
    architecturalHighlights: [
      'Multi-tiered stepped pedestal with lotus petal moldings',
      'Octagonal transitioning to circular fluted shaft',
      'Four-directional bracket capital supporting cantilevered stone beams',
      'Relief niche housing miniature sacred guardian deities'
    ]
  },
  {
    id: 'sanchi-stupa',
    name: 'Monolithic Sanchi Stupa Dome & Harmika',
    location: 'Sanchi, Raisen, Madhya Pradesh',
    period: '3rd Century BCE–1st Century CE (Mauryan/Satavahana)',
    category: 'Buddhist & Jain Heritage',
    material: 'Dressed Ashlar Sandstone & Chhatravali',
    description: 'The hemispherical stone Anda (dome) representing the vault of heaven, crowned by the square stone railing (Harmika) and the three-tiered umbrella (Chhatravali) symbolizing the Three Jewels of Buddhism.',
    architecturalHighlights: [
      'Hemispherical Anda enclosing sacred relic chamber',
      'Square Harmika balustrade preserving early stone joinery',
      'Three-tiered Chhatra representing Buddha, Dharma, and Sangha',
      'Circular Pradakshina Patha (circumambulatory path) terrace'
    ]
  },
  {
    id: 'hampi-pillar',
    name: 'Vijayanagara Resonant Temple Column',
    location: 'Vitthala Temple, Hampi, Karnataka',
    period: '16th Century CE (Vijayanagara Empire)',
    category: 'Temple Architecture & Metallurgy',
    material: 'Solid Dolerite Granite Block',
    description: 'A monolithic musical column carved from a single block of resonant granite. Surrounding the central supporting pier are slender acoustic colonnettes that resonate with distinct musical notes when struck gently.',
    architecturalHighlights: [
      'Monolithic granite core carved without separate joins',
      'Clusters of slender secondary colonnettes tuned acoustically',
      'Carved Yali (mythological rampant lion-beast) brackets',
      'Deeply undercut lotus-bud pendant finals (Pushpapodigai)'
    ]
  },
  {
    id: 'jharokha-balcony',
    name: 'Rajput Palace Jharokha Overhang',
    location: 'Mehrangarh Fort, Jodhpur, Rajasthan',
    period: '15th–17th Century CE (Rathore Dynasty)',
    category: 'Forts & Palaces',
    material: 'Chiseled Red & Pink Jodhpur Sandstone',
    description: 'An overhanging enclosed balcony (Jharokha) with delicate stone lattice screens (Jaali). Designed for cooling ventilation and royal viewing while shielding residents from the harsh desert sun.',
    architecturalHighlights: [
      'Cantilevered bracketed corbel foundation',
      'Filigreed geometric Jaali screen piercing sunlight',
      'Arched trefoil windows with fluted cupola roof',
      'Fine floral relief work reflecting Marwar artistic idioms'
    ]
  }
];

function createMonumentModel(modelId: string, isWireframe: boolean): THREE.Group {
  const group = new THREE.Group();
  group.position.y = -0.5;

  const sandstoneColor = 0xd8c4a0;
  const graniteColor = 0x8a929a;
  const terracottaColor = 0xb5533b;

  let mainColor = sandstoneColor;
  if (modelId === 'hampi-pillar') mainColor = graniteColor;
  if (modelId === 'jharokha-balcony') mainColor = terracottaColor;

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: mainColor,
    roughness: 0.75,
    metalness: 0.15,
    wireframe: isWireframe,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xcba135,
    roughness: 0.45,
    metalness: 0.4,
    wireframe: isWireframe,
  });

  if (modelId === 'stepwell-pillar') {
    // 1. STEPWELL PILLAR
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 1.4), stoneMaterial);
    b1.position.y = -1.0;
    b1.castShadow = true;
    b1.receiveShadow = true;
    group.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 1.1), stoneMaterial);
    b2.position.y = -0.75;
    b2.castShadow = true;
    group.add(b2);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 2.2, 12), stoneMaterial);
    shaft.position.y = 0.45;
    shaft.castShadow = true;
    group.add(shaft);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 16, 32), accentMaterial);
    ring.position.y = 0.45;
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    group.add(ring);

    const capBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 1.0), stoneMaterial);
    capBase.position.y = 1.65;
    capBase.castShadow = true;
    group.add(capBase);

    const capBrackets = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 0.6), stoneMaterial);
    capBrackets.position.y = 1.85;
    capBrackets.castShadow = true;
    group.add(capBrackets);

    const capCross = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 1.5), stoneMaterial);
    capCross.position.y = 1.85;
    capCross.castShadow = true;
    group.add(capCross);

    const niche = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.2), accentMaterial);
    niche.position.set(0, 0.45, 0.4);
    niche.castShadow = true;
    group.add(niche);

  } else if (modelId === 'sanchi-stupa') {
    // 2. MONOLITHIC SANCHI STUPA DOME
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, 0.6, 32), stoneMaterial);
    drum.position.y = -0.7;
    drum.castShadow = true;
    drum.receiveShadow = true;
    group.add(drum);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2), stoneMaterial);
    dome.position.y = -0.4;
    dome.castShadow = true;
    group.add(dome);

    const harmika = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), stoneMaterial);
    harmika.position.y = 1.4;
    harmika.castShadow = true;
    group.add(harmika);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), accentMaterial);
    stem.position.y = 1.9;
    stem.castShadow = true;
    group.add(stem);

    const u1 = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.15, 24), accentMaterial);
    u1.position.y = 1.75;
    u1.castShadow = true;
    group.add(u1);

    const u2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.12, 24), accentMaterial);
    u2.position.y = 2.0;
    u2.castShadow = true;
    group.add(u2);

    const u3 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.1, 24), accentMaterial);
    u3.position.y = 2.22;
    u3.castShadow = true;
    group.add(u3);

  } else if (modelId === 'hampi-pillar') {
    // 3. VIJAYANAGARA MUSICAL CLUSTER PILLAR
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 1.3), stoneMaterial);
    plinth.position.y = -0.9;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    group.add(plinth);

    const centerCol = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 2.5, 12), stoneMaterial);
    centerCol.position.y = 0.45;
    centerCol.castShadow = true;
    group.add(centerCol);

    const colonnetteGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.2, 12);
    const offsets = [
      [0.48, 0],
      [-0.48, 0],
      [0, 0.48],
      [0, -0.48]
    ];
    offsets.forEach(([x, z]) => {
      const c = new THREE.Mesh(colonnetteGeo, accentMaterial);
      c.position.set(x, 0.45, z);
      c.castShadow = true;
      group.add(c);
    });

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), stoneMaterial);
    cap.position.y = 1.8;
    cap.castShadow = true;
    group.add(cap);

  } else {
    // 4. JHAROKHA BALCONY (MEHRANGARH)
    const bracket1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 4), stoneMaterial);
    bracket1.position.y = -0.5;
    bracket1.rotation.y = Math.PI / 4;
    bracket1.rotation.x = Math.PI;
    bracket1.castShadow = true;
    group.add(bracket1);

    const bFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.25, 8), stoneMaterial);
    bFloor.position.y = 0.1;
    bFloor.castShadow = true;
    group.add(bFloor);

    const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.2, 8, 1, true, 0, Math.PI * 1.3), stoneMaterial);
    wall.position.y = 0.8;
    wall.castShadow = true;
    group.add(wall);

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), accentMaterial);
    p1.position.set(0.8, 0.8, 0.6);
    p1.castShadow = true;
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), accentMaterial);
    p2.position.set(-0.8, 0.8, 0.6);
    p2.castShadow = true;
    group.add(p2);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.7, 8), stoneMaterial);
    roof.position.y = 1.75;
    roof.castShadow = true;
    group.add(roof);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), accentMaterial);
    finial.position.y = 2.2;
    finial.castShadow = true;
    group.add(finial);
  }

  return group;
}

export const ThreeDExplorerPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedModelId, setSelectedModelId] = useState('stepwell-pillar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentMeshGroupRef = useRef<THREE.Group | null>(null);
  const autoRotateRef = useRef(autoRotate);

  const selectedModel = MONUMENT_MODELS.find((m) => m.id === selectedModelId) || MONUMENT_MODELS[0];

  // Sync autoRotate state to ref & controls
  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Initialize Three.js Scene with OrbitControls and ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const width = container.clientWidth || container.getBoundingClientRect().width || 600;
    const height = container.clientHeight || container.getBoundingClientRect().height || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1524); // Warm museum dark navy
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.5);
    camera.lookAt(0, 0.3, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Industry-Standard OrbitControls: Smooth damping, native touch gestures, wheel zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.3;
    controls.target.set(0, 0.3, 0);
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // prevent below-floor flip
    controls.enableZoom = true;
    controls.enablePan = true;
    controlsRef.current = controls;

    // Museum Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd0, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.7);
    sunLight.position.set(5, 8, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x88aacc, 0.9);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Warm Platform Pedestal
    const floorGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.1, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x16243b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // Initial Model Build (guaranteed on 1st frame)
    const initialGroup = createMonumentModel(selectedModelId, wireframe);
    scene.add(initialGroup);
    currentMeshGroupRef.current = initialGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.autoRotate = autoRotateRef.current;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ResizeObserver: Guaranteed pixel-perfect sizing on Android & Laptop
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(container);

    // Fullscreen change listener
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener('fullscreenchange', onFsChange);
      controls.dispose();
      renderer.dispose();
      container.innerHTML = '';
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      currentMeshGroupRef.current = null;
    };
  }, []);

  // Update Model Geometry or Wireframe on State Change
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Dispose old model to prevent memory leaks
    if (currentMeshGroupRef.current) {
      scene.remove(currentMeshGroupRef.current);
      currentMeshGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });
      currentMeshGroupRef.current = null;
    }

    const newGroup = createMonumentModel(selectedModelId, wireframe);
    scene.add(newGroup);
    currentMeshGroupRef.current = newGroup;

    // Reset controls target smoothly
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.3, 0);
    }
  }, [selectedModelId, wireframe]);

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 1.8, 5.5);
      controlsRef.current.target.set(0, 0.3, 0);
      controlsRef.current.reset();
    }
  };

  const toggleFullscreen = () => {
    const el = viewerWrapperRef.current || containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => null);
    } else {
      document.exitFullscreen().catch(() => null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sandstone/30 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
            Innovation Pathway A: Computer Vision & 3D WebGL
          </span>
          <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
            3D Digital Heritage Explorer
          </h1>
          <p className="text-xs text-heritage-navy/70 mt-1">
            Inspect architectural components, structural masonry, and epigraphic columns in interactive real-time WebGL.
          </p>
        </div>

        {/* Model Switcher Tabs: Horizontal Swipeable on Mobile */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {MONUMENT_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedModelId === m.id
                  ? 'bg-heritage-navy text-heritage-gold shadow-md scale-[1.02]'
                  : 'bg-white text-heritage-navy/70 hover:bg-heritage-cream/40 border border-heritage-sandstone/40'
              }`}
            >
              {m.name.split(' ')[0]} {m.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* 3D VIEWER & INFORMATION PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3D WebGL Canvas Container: Optimized Height & Full Controls for Mobile & Laptop */}
        <div 
          ref={viewerWrapperRef}
          className="lg:col-span-2 relative h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-heritage-border/70 shadow-heritage-lg bg-heritage-dark flex flex-col"
        >
          {/* Canvas Mount Target */}
          <div 
            ref={containerRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing select-none" 
            style={{ touchAction: 'none' }}
          />

          {/* Top Model Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center space-x-2 bg-heritage-navy/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-heritage-border text-xs text-heritage-ivory max-w-[80%] shadow-md">
            <Box className="w-4 h-4 text-heritage-gold shrink-0" />
            <span className="font-semibold text-[11px] truncate">{selectedModel.name}</span>
          </div>

          {/* Action Toolbar (Bottom Floating) */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-center justify-between pointer-events-none">
            
            <div className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-2 bg-heritage-dark/95 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-heritage-border/80 shadow-lg">
              <button
                onClick={resetCamera}
                title="Reset Camera Orientation"
                className="p-1.5 sm:p-2 rounded-xl text-heritage-sandstone hover:text-white hover:bg-heritage-navy active:scale-95 transition text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Reset</span>
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 sm:p-2 rounded-xl text-xs font-medium transition active:scale-95 ${
                  autoRotate ? 'bg-heritage-gold/20 text-heritage-gold font-bold' : 'text-heritage-sandstone hover:text-white'
                }`}
                title="Toggle Auto Rotation"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline ml-1 text-[11px]">Auto Rotate</span>
              </button>

              <button
                onClick={() => setWireframe(!wireframe)}
                className={`p-1.5 sm:p-2 rounded-xl text-xs font-medium transition active:scale-95 ${
                  wireframe ? 'bg-heritage-terracotta/30 text-heritage-terracottaLight font-bold' : 'text-heritage-sandstone hover:text-white'
                }`}
                title="Toggle Architectural Wireframe Mesh"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline ml-1 text-[11px]">Wireframe</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 rounded-xl text-heritage-sandstone hover:text-white hover:bg-heritage-navy active:scale-95 transition"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-heritage-gold" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Gesture Guide */}
            <div className="flex items-center space-x-1.5 bg-heritage-dark/85 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-xl border border-heritage-border/60 text-[10px] text-heritage-sandstone/80 shadow-md">
              <span className="hidden sm:inline">Left Click: Orbit · Wheel: Zoom</span>
              <span className="sm:hidden">1 Finger: Orbit · Pinch: Zoom</span>
            </div>
          </div>
        </div>

        {/* Architectural Information Panel */}
        <div className="bg-white rounded-3xl p-6 border border-heritage-sandstone/40 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-terracotta">
                Architectural Specification
              </span>
              <h2 className="font-heritage font-bold text-xl text-heritage-dark mt-1">
                {selectedModel.name}
              </h2>
            </div>

            {/* Meta Table */}
            <div className="space-y-2 p-3.5 rounded-xl bg-heritage-cream/40 border border-heritage-sandstone/40 text-xs">
              <div className="flex justify-between">
                <span className="text-heritage-navy/60 font-medium">Monument:</span>
                <span className="font-bold text-heritage-dark text-right">{selectedModel.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-heritage-navy/60 font-medium">Historical Period:</span>
                <span className="font-bold text-heritage-dark text-right">{selectedModel.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-heritage-navy/60 font-medium">Primary Material:</span>
                <span className="font-bold text-heritage-dark text-right">{selectedModel.material}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-heritage-dark uppercase mb-1">
                Structural Description
              </h4>
              <p className="text-xs text-heritage-navy/80 leading-relaxed">
                {selectedModel.description}
              </p>
            </div>

            {/* Architectural Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-heritage-dark uppercase">
                Architectural Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-heritage-navy/70">
                {selectedModel.architecturalHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-heritage-gold font-bold">›</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Future 3D Photogrammetry Roadmap Box */}
          <div className="p-3.5 rounded-xl bg-heritage-parchment border border-heritage-sandstone/50 text-[11px] space-y-1 text-heritage-navy/70">
            <div className="flex items-center space-x-1.5 text-heritage-dark font-bold text-xs">
              <Info className="w-3.5 h-3.5 text-heritage-terracotta" />
              <span>Future-Ready 3D Heritage Module</span>
            </div>
            <p className="leading-relaxed">
              Designed as a future-ready WebGL module. Future roadmap integrates multi-view stereo photogrammetry (COLMAP) and 3D Gaussian Splatting from crowdsourced archival photographs.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
