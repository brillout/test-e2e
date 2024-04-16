import { execSync } from 'child_process'
import fs from 'fs'

// Function to append ".js" to ESM imports in a given TypeScript file
const appendJsToESMImports = (filePath) => {
  console.log('filePath', filePath)

  // Read the content of the file
  let content = fs.readFileSync(filePath, 'utf8')

  const patterns = [
    //
    /import(.+)from ['"](\.[^'"]+)['"]/g,
    /export(.+)from ['"](\.[^'"]+)['"]/g,
  ]

  patterns.forEach((pattern) => {
    content = content.replace(pattern, (importStatement, _, importPath) => {
      if (importPath.endsWith('.js')) return
      const newImportPath = importPath + '.js'
      console.log('newImportPath', newImportPath)
      return importStatement.replace(importPath, newImportPath)
    })
  })

  // Write the modified content back to the file
  fs.writeFileSync(filePath, content, 'utf8')
}

// Get the list of TypeScript files in the current Git repository
const gitFiles = execSync('git ls-files "*.ts" "*.tsx"').toString().split('\n').filter(Boolean)

// Apply the import modification to each TypeScript file
gitFiles.forEach((filePath) => {
  appendJsToESMImports(filePath)
})
