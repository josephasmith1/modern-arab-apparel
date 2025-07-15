#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running prebuild checks...\n');

let hasErrors = false;

// Function to run command and capture output
function runCommand(command, options = {}) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      ...options 
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

// 1. Check Node version
console.log('1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
console.log(`   Current version: ${nodeVersion}`);
if (!nodeVersion.startsWith('v18.') && !nodeVersion.startsWith('v20.')) {
  console.log('   ⚠️  Warning: Vercel typically uses Node.js 18.x or 20.x');
}
console.log('');

// 2. Check if all dependencies are installed
console.log('2️⃣  Checking dependencies...');
const { success: depsSuccess } = runCommand('npm ls --depth=0');
if (!depsSuccess) {
  console.log('   ❌ Some dependencies might be missing. Run: npm install');
  hasErrors = true;
} else {
  console.log('   ✅ All dependencies installed');
}
console.log('');

// 3. Run TypeScript type checking
console.log('3️⃣  Running TypeScript type check...');
const { success: tscSuccess, error: tscError } = runCommand('npx tsc --noEmit');
if (!tscSuccess) {
  console.log('   ❌ TypeScript errors found:');
  console.log(tscError);
  hasErrors = true;
} else {
  console.log('   ✅ No TypeScript errors');
}
console.log('');

// 4. Run ESLint
console.log('4️⃣  Running ESLint...');
const { success: eslintSuccess, output: eslintOutput, error: eslintError } = runCommand('npx next lint');
if (!eslintSuccess) {
  console.log('   ❌ ESLint errors found:');
  console.log(eslintError || eslintOutput);
  hasErrors = true;
} else if (eslintOutput.includes('Warning')) {
  console.log('   ⚠️  ESLint warnings found:');
  console.log(eslintOutput);
} else {
  console.log('   ✅ No ESLint errors');
}
console.log('');

// 5. Check for common import issues
console.log('5️⃣  Checking for common import issues...');
const srcDir = path.join(process.cwd(), 'src');
let importIssues = [];

function checkImports(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkImports(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Check for missing file extensions in relative imports
        const relativeImport = line.match(/from ['"](\.[^'"]+)['"]/);
        if (relativeImport && !relativeImport[1].includes('.')) {
          const importPath = relativeImport[1];
          const possiblePaths = [
            `${importPath}.ts`,
            `${importPath}.tsx`,
            `${importPath}/index.ts`,
            `${importPath}/index.tsx`
          ];
          
          const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
          let found = false;
          
          for (const possible of possiblePaths) {
            if (fs.existsSync(path.resolve(path.dirname(fullPath), possible))) {
              found = true;
              break;
            }
          }
          
          if (!found && !fs.existsSync(resolvedPath)) {
            importIssues.push({
              file: fullPath.replace(process.cwd(), '.'),
              line: index + 1,
              import: importPath
            });
          }
        }
      });
    }
  }
}

try {
  checkImports(srcDir);
  if (importIssues.length > 0) {
    console.log('   ❌ Found potential import issues:');
    importIssues.forEach(issue => {
      console.log(`      ${issue.file}:${issue.line} - Cannot resolve '${issue.import}'`);
    });
    hasErrors = true;
  } else {
    console.log('   ✅ No import issues found');
  }
} catch (error) {
  console.log('   ⚠️  Error checking imports:', error.message);
}
console.log('');

// 6. Check for unused exports and files
console.log('6️⃣  Checking for build-blocking files...');
const problematicFiles = [
  'src/app/products/[slug]/page.backup.tsx',
  'src/app/products/[slug]/page.original.tsx'
];

problematicFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`   ⚠️  Found problematic file: ${file} (may cause build errors)`);
  }
});
console.log('');

// 7. Try a production build
console.log('7️⃣  Attempting production build...');
console.log('   This may take a moment...\n');

const buildResult = runCommand('npm run build', { stdio: 'inherit' });
if (!buildResult.success) {
  console.log('\n   ❌ Build failed!');
  hasErrors = true;
} else {
  console.log('\n   ✅ Build successful!');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Prebuild check failed! Fix the errors above before pushing.');
  process.exit(1);
} else {
  console.log('✅ All prebuild checks passed! Safe to push to Vercel.');
  process.exit(0);
}