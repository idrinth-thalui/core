const fs = require('fs');
const path = require('path');

// Directories to exclude
const excludedDirs = ['.git', '.github', '_layout', 'angular-idrinth', 'assets'];

// Function to recursively get file structure, including .md file contents
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
        // Include .md files and read their contents
        else if (stats.isFile() && path.extname(file) === '.md') {
            const fileContents = fs.readFileSync(filePath, 'utf8'); // Read file content
            structure[file] = fileContents; // Store the actual content of the file
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

// Write the file structure with file contents to fileStructure.json
fs.writeFileSync(outputFile, JSON.stringify(fileStructure, null, 2), 'utf8');

console.log(`File structure and contents have been saved to ${outputFile}`);
