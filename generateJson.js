const fs = require('fs');
const path = require('path');

// Function to recursively get file structure
function getFileStructure(dirPath) {
    const files = fs.readdirSync(dirPath);
    const structure = {};

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            structure[file] = getFileStructure(filePath); // Recursively get directory content
        } else {
            structure[file] = 'file'; // Mark as file
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
