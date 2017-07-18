var fileSystem = require("fs-extra"),
    path = require("path"),
    env = require("./env");

fileSystem.copySync('src/assets', 'build/assets');
