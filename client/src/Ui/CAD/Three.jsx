/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { STLLoader }      from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls'
import WebGL              from 'three/addons/capabilities/WebGL.js'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const BG = {
  dark:  0x1C1C1A,   // --color-neutral-black (muted warm black)
  light: 0xE0EAE4,   // --color-card-bg (muted sage tint)
}

const MODEL_MATERIAL = {
  color:     0x7A8880,  // muted sage-grey
  metalness: 0.5,
  roughness: 0.5,
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useThreeScene
// Sets up renderer, camera, lights, OrbitControls, and the animation loop.
// Cleans up fully on unmount. NEVER re-runs — deps are intentionally empty.
// ─────────────────────────────────────────────────────────────────────────────
function useThreeScene(containerRef) {
  const sceneRef    = useRef(null)
  const cameraRef   = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const frameIdRef  = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    sceneRef.current = new THREE.Scene()
    sceneRef.current.background = new THREE.Color(BG.dark)

    // Camera
    const aspect = container.clientWidth / container.clientHeight
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    cameraRef.current.position.set(0, 10, 0)

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    rendererRef.current.setSize(container.clientWidth, container.clientHeight)
    rendererRef.current.setPixelRatio(window.devicePixelRatio)
    rendererRef.current.shadowMap.enabled   = true
    rendererRef.current.shadowMap.type      = THREE.PCFSoftShadowMap
    rendererRef.current.outputColorSpace    = THREE.SRGBColorSpace
    rendererRef.current.toneMapping         = THREE.ACESFilmicToneMapping
    rendererRef.current.toneMappingExposure = 1
    container.appendChild(rendererRef.current.domElement)

    // Lights
    const dirLight = new THREE.DirectionalLight(0xffffff, 3)
    dirLight.position.set(5, 10, 5)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.set(2048, 2048)
    sceneRef.current.add(dirLight)
    sceneRef.current.add(new THREE.AmbientLight(0xcccccc, 1))
    sceneRef.current.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1))

    // Controls
    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
    controlsRef.current.enableDamping      = true
    controlsRef.current.dampingFactor      = 0.05
    controlsRef.current.screenSpacePanning = false

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)
      controlsRef.current?.update()
      rendererRef.current?.render(sceneRef.current, cameraRef.current)
    }
    animate()

    // ResizeObserver — container-aware, not window-aware
    // Window resize misses reflows caused by panel open/close.
    const ro = new ResizeObserver(() => {
      const c = containerRef.current
      if (!c || !cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = c.clientWidth / c.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(c.clientWidth, c.clientHeight)
    })
    ro.observe(container)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(frameIdRef.current)
      controlsRef.current?.dispose()
      rendererRef.current?.dispose()
      rendererRef.current?.forceContextLoss()
      if (rendererRef.current?.domElement && container) {
        container.removeChild(rendererRef.current.domElement)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Intentionally empty — scene must init once only.

  return { sceneRef, cameraRef, rendererRef, controlsRef }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers shared by useSTLModel
// ─────────────────────────────────────────────────────────────────────────────

/** Dispose a mesh and remove it from the scene. */
function disposeMesh(scene, mesh) {
  if (!mesh || !scene) return
  mesh.traverse((child) => {
    if (!child.isMesh) return
    child.geometry.dispose()
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.forEach((m) => m.dispose())
  })
  scene.remove(mesh)
}

/** Centre a mesh at the scene origin. */
function centreObject(mesh) {
  const box    = new THREE.Box3().setFromObject(mesh)
  const centre = new THREE.Vector3()
  box.getCenter(centre)
  mesh.position.sub(centre)
}

/** Build a mesh from geometry with the shared material. */
function buildMesh(geometry) {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial(MODEL_MATERIAL))
  mesh.castShadow    = true
  mesh.receiveShadow = true
  centreObject(mesh)
  return mesh
}

/**
 * Placeholder shown when the STL cannot be loaded.
 * TorusKnotGeometry reads as mechanical/gear-like and keeps the
 * 3-D viewport useful while the real model is unavailable.
 */
function buildPlaceholder() {
  const mesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3, 0.8, 128, 32),
    new THREE.MeshStandardMaterial({ ...MODEL_MATERIAL, color: 0x506A5E }),
  )
  mesh.castShadow    = true
  mesh.receiveShadow = true
  return mesh
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useSTLModel
//
// Root cause of the original RangeError:
//   STLLoader reads a 4-byte uint at byte 80 of the file to get the triangle
//   count, then allocates Float32Array(count * 50).  When the "file" is an
//   HTML error page (404/403) or a mis-identified ASCII STL, that uint is
//   garbage (here: 15 008 316 894) and the allocation throws synchronously
//   INSIDE the success callback — before the onError handler can catch it.
//
// Fix: wrap the success callback body in try/catch and route failures to the
// same fallback path used for network errors.  Fallback mounts a placeholder
// geometry so the Three.js viewport stays functional.
// ─────────────────────────────────────────────────────────────────────────────
function useSTLModel(sceneRef, modelPath) {
  const objectRef = useRef(null)
  const [isLoading,     setIsLoading]     = useState(false)
  const [isPlaceholder, setIsPlaceholder] = useState(false)

  const swapMesh = useCallback((mesh) => {
    disposeMesh(sceneRef.current, objectRef.current)
    objectRef.current = mesh
    sceneRef.current?.add(mesh)
  }, [sceneRef])

  const mountPlaceholder = useCallback((reason) => {
    console.warn('Three.jsx — falling back to placeholder geometry:', reason?.message ?? reason)
    swapMesh(buildPlaceholder())
    setIsPlaceholder(true)
    setIsLoading(false)
  }, [swapMesh])

  useEffect(() => {
    if (!sceneRef.current || !modelPath) return

    setIsLoading(true)
    setIsPlaceholder(false)

    const loader = new STLLoader()
    loader.load(
      modelPath,
      (geometry) => {
        try {
          swapMesh(buildMesh(geometry))
          setIsLoading(false)
        } catch (parseErr) {
          // RangeError from garbage triangle count lands here
          mountPlaceholder(parseErr)
        }
      },
      undefined,
      (networkErr) => mountPlaceholder(networkErr),
    )
  }, [sceneRef, modelPath, swapMesh, mountPlaceholder])

  return { objectRef, isLoading, isPlaceholder }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const ControlSlider = ({ id, label, value, min, max, step, onChange }) => (
  <label className="flex flex-col gap-0.5 min-w-[5rem]">
    <span className="font-mono text-[0.65rem] text-neutral-black/60 uppercase tracking-wider">
      {label}
    </span>
    <div className="flex items-center gap-1">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <span className="font-mono text-xs w-8 text-right">{Number(value).toFixed(1)}</span>
    </div>
  </label>
)

const ControlToggle = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider
      border transition-colors duration-fast
      ${active
        ? 'bg-neutral-black text-neutral-white border-neutral-black'
        : 'bg-transparent text-neutral-black/60 border-card-border hover:border-sage hover:text-sage'
      }
    `}
  >
    {label}
  </button>
)

const ControlAction = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="
      px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider
      border border-card-border text-neutral-black/60
      hover:border-sage hover:text-sage
      transition-colors duration-fast
    "
  >
    {label}
  </button>
)

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
function Three({
  modelPath = 'src/UI/original.stl',
  width     = '99%',
  height    = '60vh',
}) {
  const containerRef = useRef(null)

  const webglError = !WebGL.isWebGL2Available() ? WebGL.getWebGL2ErrorMessage() : null

  const { sceneRef, cameraRef, controlsRef } = useThreeScene(containerRef)
  const { objectRef, isLoading, isPlaceholder } = useSTLModel(sceneRef, modelPath)

  // Controller state
  const [scale,      setScale]      = useState(1)
  const [wireframe,  setWireframe]  = useState(false)
  const [darkBg,     setDarkBg]     = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)

  const handleScale = useCallback((e) => {
    const v = parseFloat(e.target.value)
    setScale(v)
    objectRef.current?.scale.set(v, v, v)
  }, [objectRef])

  const handleWireframe = useCallback(() => {
    setWireframe((prev) => {
      const next = !prev
      objectRef.current?.traverse((child) => {
        if (child.isMesh) child.material.wireframe = next
      })
      return next
    })
  }, [objectRef])

  const handleBg = useCallback(() => {
    setDarkBg((prev) => {
      const next = !prev
      sceneRef.current?.background.set(next ? BG.dark : BG.light)
      return next
    })
  }, [sceneRef])

  const handleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev
      if (controlsRef.current) controlsRef.current.autoRotate = next
      return next
    })
  }, [controlsRef])

  const handleResetCamera = useCallback(() => {
    cameraRef.current?.position.set(0, 10, 0)
    controlsRef.current?.target.set(0, 0, 0)
    controlsRef.current?.update()
  }, [cameraRef, controlsRef])

  if (webglError) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center border border-role-admin font-mono text-xs text-role-admin p-3"
      >
        WebGL 2 is not available in this browser.
      </div>
    )
  }

  return (
    <div style={{ width, height }} className="flex flex-col gap-2">

      {/* Controller bar */}
      <div className="flex flex-wrap items-end gap-3 px-1">
        <ControlSlider
          id="scale"
          label="Scale"
          value={scale}
          min={1} max={100} step={1}
          onChange={handleScale}
        />
        <div className="flex items-center gap-1">
          <ControlToggle label="Wireframe"   active={wireframe}  onClick={handleWireframe} />
          <ControlToggle label="Dark bg"     active={darkBg}     onClick={handleBg} />
          <ControlToggle label="Auto-rotate" active={autoRotate} onClick={handleAutoRotate} />
          <ControlAction label="⌖ Reset"                         onClick={handleResetCamera} />
        </div>
      </div>

      {/* Viewport */}
      <div className="relative flex-1">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-black/60 z-10">
            <span className="font-mono text-xs text-neutral-white animate-pulse">
              Loading model…
            </span>
          </div>
        )}

        {/* Placeholder notice — non-blocking, sits under controls */}
        {isPlaceholder && !isLoading && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-1 font-mono text-[0.6rem] text-neutral-black/50 bg-neutral-white/70">
            preview — model unavailable
          </div>
        )}

        {/* Three.js canvas mount */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-hidden"
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    </div>
  )
}

export default Three