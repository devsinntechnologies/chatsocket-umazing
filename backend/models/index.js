// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const sequelize = require('../config/database'); // Import Sequelize instance

// const basename = path.basename(__filename);
// const db = {};

// // Dynamically import all models from the current directory
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     // Exclude hidden files, index.js, and non-JavaScript files
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js'
//     );
//   })
//   .forEach((file) => {
//     try {
//       // Import the model and initialize it with sequelize
//       const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//       db[model.name] = model; // Add model to db object
//     } catch (error) {
//       console.error(`Error loading model file: ${file}`, error);
//     }
//   });

// // Apply associations if defined in the models
//   Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//         console.log(`Associating model: ${modelName}`); // Debug: Check association process
//         db[modelName].associate(db);
//     }
// });

// // Add sequelize instance and Sequelize library to db object
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
  