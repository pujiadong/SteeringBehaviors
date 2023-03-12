const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
        var filePath = path.join(dirent.name);
        if (dirent.isFile()) {
            callback(filePath, dirent);
        } else if (dirent.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
walkSync('build', function (filePath, stat) {
    console.log(filePath);
    let data = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>${filePath}</title>
</head>
<body>
    <canvas id="canvas" width="600" height="600" style="border: 1px solid salmon"></canvas>
    <script src="../build/utils.js"></script>
    <script src="../build/${filePath}"></script>
</body>
</html>
    `
    if (filePath.endsWith('.js') && !filePath.endsWith('utils.js')) {
        let filename = filePath.split('.')[0];
        fs.writeFile(`./html/${filename}.html`, data.trim(), (error => {
            if (error) {
                console.log(`create fail: ${filePath}.html`);
            } else {
                console.log(`create success: ${filePath}.html`);
            }
        }))
    }
});