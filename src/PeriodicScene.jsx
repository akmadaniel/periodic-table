import { useEffect, useRef, useState } from 'react'
import { PerspectiveCamera, Scene, Vector3 } from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { netWorthColor } from './color'
import { layouts, targetsFor } from './layouts'

function makeTile(p) {
  const el = document.createElement('div')
  const c = netWorthColor(p.worthNum)
  el.className = 'tile'
  el.style.background = `rgba(${c},0.5)`
  el.style.borderColor = `rgb(${c})`
  el.style.boxShadow = `0 0 12px rgba(${c},0.6)`
  // textContent, not innerHTML: sheet data is untrusted
  const top = document.createElement('div'); top.className = 'top'
  top.append(Object.assign(document.createElement('span'), { textContent: p.country }),
             Object.assign(document.createElement('span'), { textContent: p.age }))
  const img = Object.assign(document.createElement('img'), { src: p.photo, alt: p.name, draggable: false })
  const name = Object.assign(document.createElement('div'), { className: 'name', textContent: p.name })
  const rest = Object.assign(document.createElement('div'), { textContent: `${p.interest} · ${p.worth}` })
  el.append(top, img, name, rest)
  return new CSS3DObject(el)
}

const UP = new Vector3(0, 1, 0)

export default function PeriodicScene({ people }) {
  const host = useRef()
  const targets = useRef([])
  const view = useRef({ name: 'table', sorted: false })
  const [sorted, setSorted] = useState(false)

  const camGoal = useRef(null)

  const update = (patch) => {
    Object.assign(view.current, patch)
    targets.current = targetsFor(view.current.name, people, view.current.sorted)
  }

  const setLayout = (name) => {
    update({ name })
    // grid is deep: view it at an angle so the 5 layers don't hide each other
    camGoal.current = name === 'grid' ? new Vector3(3200, 500, 3400) : new Vector3(0, 0, 3600)
  }

  const toggleSort = () => {
    update({ sorted: !view.current.sorted })
    setSorted(view.current.sorted)
  }

  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera(40, innerWidth / innerHeight, 1, 10000)
    camera.position.z = 3600
    const renderer = new CSS3DRenderer()
    renderer.setSize(innerWidth, innerHeight)
    host.current.appendChild(renderer.domElement)
    // same controls and limits as the three.js css3d_periodictable demo
    const controls = new TrackballControls(camera, renderer.domElement)
    controls.minDistance = 500
    controls.maxDistance = 6000

    const tiles = people.map((p) => { const t = makeTile(p); scene.add(t); return t })
    targets.current = targetsFor(view.current.name, people, view.current.sorted)
    tiles.forEach((t, i) => { t.position.copy(targets.current[i].position); t.quaternion.copy(targets.current[i].quaternion) })

    let raf
    const loop = () => {
      tiles.forEach((t, i) => {
        t.position.lerp(targets.current[i].position, 0.08)
        t.quaternion.slerp(targets.current[i].quaternion, 0.08)
      })
      if (camGoal.current) {
        camera.position.lerp(camGoal.current, 0.06)
        camera.up.lerp(UP, 0.06).normalize() // undo any roll from trackball dragging
        if (camera.position.distanceTo(camGoal.current) < 5) camGoal.current = null
      }
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    loop()
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight)
    }
    addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); renderer.domElement.remove() }
  }, [people])

  return (
    <>
      <div ref={host} />
      <div className="bar">
        {Object.keys(layouts).map((n) => (
          <button key={n} onClick={() => setLayout(n)}>{n.toUpperCase()}</button>
        ))}
        <button
          onClick={toggleSort}
          className={sorted ? 'on' : ''}
          aria-pressed={sorted}
          aria-label="Sort by net worth"
          title={sorted ? 'Sorted by net worth (click to undo)' : 'Sort by net worth'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
          </svg>
        </button>
        <div className="legend">
          Net Worth:
          <i style={{ background: 'rgb(239,48,34)' }} />&lt; $100K
          <i style={{ background: 'rgb(253,150,30)' }} />$100K – $200K
          <i style={{ background: 'rgb(58,159,72)' }} />&gt; $200K
        </div>
      </div>
    </>
  )
}
