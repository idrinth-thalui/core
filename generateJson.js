const fs = require('fs');
const path = require('path');

// Directories to exclude
const excludedDirs = ['.git', '.github', '_layout', 'angular-idrinth', 'assets'];

// Function to recursively get file structure, only including .md files
function getFileStructure(dirPath) {
    const files = fs.readdirSync(dirPath);
    const structure = {};

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        // Check if it's a directory and not in the excluded list
        if (stats.isDirectory() && !excludedDirs.includes(file)) {
            const subStructure = getFileStructure(filePath);
            // Only include the directory if it contains files or subdirectories
            if (Object.keys(subStructure).length > 0) {
                structure[file] = subStructure;
            }
        } 
        // Include only .md files
        else if (stats.isFile() && path.extname(file) === '.md') {
            structure[file] = 'file'; // Only include .md files
        }
    });

    return structure;
}

// Root path to start
const rootPath = path.join(__dirname);

// Get file structure
const fileStructure = getFileStructure(rootPath);

// Output path where to save the JSON file
const outputDir = path.join(__dirname, 'angular-idrinth/public/data');
const outputFile = path.join(outputDir, 'fileStructure.json');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write the file structure to fileStructure.json
fs.writeFileSync(outputFile, JSON.stringify(fileStructure, null, 2), 'utf8');

console.log(`File structure has been saved to ${outputFile}`);
