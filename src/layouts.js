import { Object3D, Vector3 } from 'three'

// each layout: (i, n) -> Object3D with position + orientation; n = 200
const at = (x, y, z, look) => {
  const o = new Object3D()
  o.position.set(x, y, z)
  if (look) o.lookAt(look)
  return o
}

export const layouts = {
  table: (i) => at(((i % 20) - 9.5) * 140, -(Math.floor(i / 20) - 4.5) * 180, 0),
  sphere: (i, n) => {
    const phi = Math.acos(-1 + (2 * i) / n)
    const theta = Math.sqrt(n * Math.PI) * phi
    const p = new Vector3().setFromSphericalCoords(800, phi, theta)
    return at(p.x, p.y, p.z, p.clone().multiplyScalar(2))
  },
  // two strands, half a turn apart
  helix: (i) => {
    const k = Math.floor(i / 2)
    const t = k * 0.15 + (i % 2) * Math.PI
    const x = 900 * Math.sin(t), z = 900 * Math.cos(t), y = -k * 14 + 700
    return at(x, y, z, new Vector3(x * 2, y, z * 2))
  },
  // 10 wide x 4 tall x 5 deep
  grid: (i) => at(((i % 10) - 4.5) * 220, -(Math.floor(i / 10) % 4 - 1.5) * 300, (Math.floor(i / 40) - 2) * 800),
}
