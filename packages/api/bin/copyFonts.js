const fs = require('fs-extra');
const path = require('path');

fs.copy(path.join(__dirname, '../fonts'), path.join(__dirname, '../dist/fonts'));
