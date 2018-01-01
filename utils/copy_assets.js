const fileSystem = require('fs-extra')
const path = require('path')

const sourceDir = path.join(__dirname, '../src/assets')
const destDir = path.join(__dirname, '../build/assets')

if (fileSystem.existsSync(sourceDir)) {
  fileSystem.copySync(sourceDir, destDir)
}
