const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/app/(espanhol)/espanhol', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace routes
    content = content.replace(/'\/app\//g, "'/espanhol/");
    content = content.replace(/"\/app\//g, "\"/espanhol/");
    content = content.replace(/'\/app'/g, "'/espanhol'");
    content = content.replace(/"\/app"/g, "\"/espanhol\"");
    
    // Replace theme colors (emerald -> orange)
    content = content.replace(/emerald-/g, 'orange-');
    
    // Flashcard text replacements
    content = content.replace(/EN - PT/g, 'ES - PT');
    content = content.replace(/Inglês/g, 'Espanhol');
    content = content.replace(/inglês/g, 'espanhol');
    
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
});
