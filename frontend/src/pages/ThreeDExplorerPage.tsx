import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
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

export const ThreeDExplorerPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedModelId, setSelectedModelId] = useState('stepwell-pillar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentMeshGroupRef = useRef<THREE.Group | null>(null);

  const selectedModel = MONUMENT_MODELS.find((m) => m.id === selectedModelId) || MONUMENT_MODELS[0];

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e192d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Museum Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.6);
    sunLight.position.set(5, 8, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x88aacc, 0.7);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Warm Ground Platform
    const floorGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.1, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x182744,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // Mouse Interaction Variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const domElement = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !currentMeshGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      currentMeshGroupRef.current.rotation.y += deltaX * 0.008;
      currentMeshGroupRef.current.rotation.x += deltaY * 0.005;

      // Restrict pitch
      currentMeshGroupRef.current.rotation.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, currentMeshGroupRef.current.rotation.x)
      );

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(2.5, Math.min(9.0, cameraRef.current.position.z));
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && currentMeshGroupRef.current && !isDragging) {
        currentMeshGroupRef.current.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Build / Switch 3D Architectural Models
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing mesh group
    if (currentMeshGroupRef.current) {
      scene.remove(currentMeshGroupRef.current);
    }

    const group = new THREE.Group();
    group.position.y = -0.5;

    // Textures / Material definitions
    const sandstoneColor = 0xd8c4a0;
    const graniteColor = 0x8a929a;
    const terracottaColor = 0xb5533b;

    let mainColor = sandstoneColor;
    if (selectedModelId === 'hampi-pillar') mainColor = graniteColor;
    if (selectedModelId === 'jharokha-balcony') mainColor = terracottaColor;

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: wireframe,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xcba135,
      roughness: 0.5,
      metalness: 0.3,
      wireframe: wireframe,
    });

    if (selectedModelId === 'stepwell-pillar') {
      // 1. STEPWELL PILLAR WITH TIERED BASE AND CARVED CAPITAL
      // Base tiers
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 1.4), stoneMaterial);
      b1.position.y = -1.0;
      group.add(b1);

      const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 1.1), stoneMaterial);
      b2.position.y = -0.75;
      group.add(b2);

      // Fluted Octagonal Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 2.2, 8), stoneMaterial);
      shaft.position.y = 0.45;
      group.add(shaft);

      // Decorative Center Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 16, 32), accentMaterial);
      ring.position.y = 0.45;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // Bracket Capital
      const capBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 1.0), stoneMaterial);
      capBase.position.y = 1.65;
      group.add(capBase);

      const capBrackets = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 0.6), stoneMaterial);
      capBrackets.position.y = 1.85;
      group.add(capBrackets);

      const capCross = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 1.5), stoneMaterial);
      capCross.position.y = 1.85;
      group.add(capCross);

      // Carved Niche Figure
      const niche = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.2), accentMaterial);
      niche.position.set(0, 0.45, 0.4);
      group.add(niche);

    } else if (selectedModelId === 'sanchi-stupa') {
      // 2. MONOLITHIC STUPA DOME AND HARMIKA
      // Circular drum
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, 0.6, 32), stoneMaterial);
      drum.position.y = -0.7;
      group.add(drum);

      // Hemispherical Anda (Dome)
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2), stoneMaterial);
      dome.position.y = -0.4;
      group.add(dome);

      // Harmika (Square railing)
      const harmika = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), stoneMaterial);
      harmika.position.y = 1.4;
      group.add(harmika);

      // Chhatravali (Three-tiered umbrellas)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), accentMaterial);
      stem.position.y = 1.9;
      group.add(stem);

      const u1 = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.15, 24), accentMaterial);
      u1.position.y = 1.75;
      group.add(u1);

      const u2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.12, 24), accentMaterial);
      u2.position.y = 2.0;
      group.add(u2);

      const u3 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.1, 24), accentMaterial);
      u3.position.y = 2.22;
      group.add(u3);

    } else if (selectedModelId === 'hampi-pillar') {
      // 3. VIJAYANAGARA MUSICAL CLUSTER PILLAR
      // Granite plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 1.3), stoneMaterial);
      plinth.position.y = -0.9;
      group.add(plinth);

      // Central Column
      const centerCol = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 2.5, 12), stoneMaterial);
      centerCol.position.y = 0.45;
      group.add(centerCol);

      // 4 Peripheral Slender Musical Colonnettes
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
        group.add(c);
      });

      // Fluted capital with Pushpapodigai pendant
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), stoneMaterial);
      cap.position.y = 1.8;
      group.add(cap);

    } else {
      // 4. JHAROKHA BALCONY (MEHRANGARH)
      // Corbel brackets
      const bracket1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 4), stoneMaterial);
      bracket1.position.y = -0.5;
      bracket1.rotation.y = Math.PI / 4;
      bracket1.rotation.x = Math.PI;
      group.add(bracket1);

      // Balcony floor
      const bFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.25, 8), stoneMaterial);
      bFloor.position.y = 0.1;
      group.add(bFloor);

      // Screen walls with simulated perforated apertures
      const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.2, 8, 1, true, 0, Math.PI * 1.3), stoneMaterial);
      wall.position.y = 0.8;
      group.add(wall);

      // Trefoil arch columns
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), accentMaterial);
      p1.position.set(0.8, 0.8, 0.6);
      group.add(p1);

      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), accentMaterial);
      p2.position.set(-0.8, 0.8, 0.6);
      group.add(p2);

      // Overhanging Bangaldar curved roof / Chhatri dome
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.7, 8), stoneMaterial);
      roof.position.y = 1.75;
      group.add(roof);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), accentMaterial);
      finial.position.y = 2.2;
      group.add(finial);
    }

    scene.add(group);
    currentMeshGroupRef.current = group;

  }, [selectedModelId, wireframe]);

  const resetCamera = () => {
    if (cameraRef.current && currentMeshGroupRef.current) {
      cameraRef.current.position.set(0, 1.8, 5.5);
      currentMeshGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => null);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => null);
      setIsFullscreen(false);
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

        {/* Model Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {MONUMENT_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedModelId === m.id
                  ? 'bg-heritage-navy text-heritage-gold shadow-sm'
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
        
        {/* 3D WebGL Canvas Container */}
        <div className="lg:col-span-2 relative h-[520px] rounded-3xl overflow-hidden border border-heritage-border/70 shadow-heritage-lg bg-heritage-dark">
          
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Overlay Controls */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-heritage-navy/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-heritage-border text-xs text-heritage-ivory">
            <Box className="w-4 h-4 text-heritage-gold" />
            <span className="font-semibold text-[11px]">{selectedModel.name}</span>
          </div>

          {/* Action Toolbar (Bottom Floating) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            
            <div className="pointer-events-auto flex items-center space-x-2 bg-heritage-dark/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-heritage-border/80 shadow-md">
              <button
                onClick={resetCamera}
                title="Reset Camera Orientation"
                className="p-1.5 rounded-lg text-heritage-sandstone hover:text-white hover:bg-heritage-navy transition text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Reset View</span>
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  autoRotate ? 'bg-heritage-gold/20 text-heritage-gold' : 'text-heritage-sandstone hover:text-white'
                }`}
                title="Toggle Auto Rotation"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setWireframe(!wireframe)}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  wireframe ? 'bg-heritage-terracotta/30 text-heritage-terracottaLight' : 'text-heritage-sandstone hover:text-white'
                }`}
                title="Toggle Architectural Wireframe Mesh"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-heritage-sandstone hover:text-white hover:bg-heritage-navy transition"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Mouse Gesture Guide */}
            <div className="hidden sm:flex items-center space-x-2 bg-heritage-dark/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-heritage-border/60 text-[10px] text-heritage-sandstone/70">
              <span>Drag to Orbit</span>
              <span>·</span>
              <span>Scroll to Zoom</span>
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

