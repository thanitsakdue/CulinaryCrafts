/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

function main() {
  if (process.platform !== 'win32') return

  // Next writes build output into `distDir` (defaults to `.next`).
  // Keeping it inside the project avoids Node module resolution issues.
  const projectRoot = path.resolve(__dirname, '..')
  const distAbs = path.resolve(projectRoot, '.next')

  try {
    fs.mkdirSync(distAbs, { recursive: true })
  } catch (err) {
    console.error('[ensure-next-dist] Failed to create dist directory:', err)
    console.error(`[ensure-next-dist] distAbs: ${distAbs}`)
    throw err
  }
}

main()
