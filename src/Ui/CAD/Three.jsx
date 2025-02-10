/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { Alert } from 'react-bootstrap'

function Three({
  modelPath = 'src/UI/gear.stl', // Default STL file path
  width = '99%',
  height = '60vh',
}) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const frameIdRef = useRef(null)
  const objectRef = useRef(null)
  const [error, setError] = useState('')
  const [scale, setScale] = useState(1) // State for model scale

  useEffect(() => {
    if (!modelPath) {
      setError('No 3D model file path provided.')
      return
    }

    if (!containerRef.current) return

    if (!WebGL.isWebGL2Available()) {
      setError(WebGL.getWebGL2ErrorMessage())
      return
    }

    // Initialize scene
    sceneRef.current = new THREE.Scene()
    sceneRef.current.background = new THREE.Color(0x000) // Light gray background

    // Initialize camera
    const container = containerRef.current
    const aspect = container.clientWidth / container.clientHeight
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    cameraRef.current.position.set(0, 10, 0) // Fixed camera position

    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    rendererRef.current.setSize(container.clientWidth, container.clientHeight)
    rendererRef.current.setPixelRatio(window.devicePixelRatio)
    rendererRef.current.shadowMap.enabled = true
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping
    rendererRef.current.toneMappingExposure = 1
    container.appendChild(rendererRef.current.domElement)

    // Enhanced lighting setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    sceneRef.current.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0xcccccc, 1)
    sceneRef.current.add(ambientLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
    sceneRef.current.add(hemiLight)

    // Initialize OrbitControls
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement,
    )
    controlsRef.current.enableDamping = true
    controlsRef.current.dampingFactor = 0.05
    controlsRef.current.screenSpacePanning = false

    // Configure STL loader
    const loader = new STLLoader()

    // Load the STL model
    loader.load(
      modelPath,
      (geometry) => {
        if (objectRef.current) {
          sceneRef.current.remove(objectRef.current) // Remove previous model if it exists
        }

        // Create a material for the STL model
        const material = new THREE.MeshStandardMaterial({
          color: 0x888888, // Green color
          metalness: 0.5,
          roughness: 0.5,
        })

        // Create a mesh from the geometry and material
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true

        objectRef.current = mesh
        sceneRef.current.add(objectRef.current)

        // Center the model at the origin
        const box = new THREE.Box3().setFromObject(objectRef.current)
        const center = new THREE.Vector3()
        box.getCenter(center)
        objectRef.current.position.sub(center)

        // Set initial scale
        objectRef.current.scale.set(scale, scale, scale)

        // Update controls target
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      },
      (progress) => {
        // Optional: Log loading progress
        const percentComplete = (progress.loaded / progress.total) * 100
        console.log(`Loading: ${Math.round(percentComplete)}%`)
      },
      (error) => {
        console.error('Error loading STL model:', error)
        setError(
          'Failed to load the 3D model. Please check the file path and format.',
        )
      },
    )

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      if (controlsRef.current) {
        controlsRef.current.update() // Required for damping
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return

      const container = containerRef.current
      const newAspect = container.clientWidth / container.clientHeight

      cameraRef.current.aspect = newAspect
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)

      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (controlsRef.current) {
        controlsRef.current.dispose()
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
        if (rendererRef.current.domElement && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }

      if (objectRef.current) {
        objectRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose())
              } else {
                child.material.dispose()
              }
            }
          }
        })
        sceneRef.current?.remove(objectRef.current)
      }
    }
  }, [modelPath, scale]) // Add scale to dependency array

  // Handle scale change
  const handleScaleChange = (event) => {
    const newScale = parseFloat(event.target.value)
    setScale(newScale)

    if (objectRef.current) {
      objectRef.current.scale.set(newScale, newScale, newScale)
    }
  }

  return (
    <div style={{ width, height }}>
      {error ? (
        <Alert variant='danger'>{error}</Alert>
      ) : (
        <>
          {/* Slider for size control */}
          <div
            style={{
              fontFamily: ` var(--font-family-mono)`,
              fontWeight: ' var(--font-weight-bold)',
              fontSize: '0.9em',
            }}
          >
            <label htmlFor='scale'>
              Scale: <span> {scale.toFixed(1)}</span>{' '}
            </label>
            <input
              className='form-range'
              type='range'
              id='scale'
              min='1'
              max='100'
              step='1'
              value={scale}
              onChange={handleScaleChange}
            />
          </div>

          {/* Container for Three.js renderer */}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: 'calc(100% - 30px)',
              overflow: 'hidden',
              borderRadius: '7px',
            }}
          />
        </>
      )}
    </div>
  )
}

export default Three
