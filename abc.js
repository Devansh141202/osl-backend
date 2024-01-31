const jsonData = require("./Indian_Cities_In_States_JSON.json")
for (let stateName in jsonData) {
//   console.log(stateName);
  const districts = jsonData[stateName];
  console.log(districts)
}
// const mongoose = require("mongoose");
// const State = require("./models/State"); // Update the path accordingly
// const District = require("./models/District"); // Update the path accordingly
// const jsonData = require("./path/to/your/json/file.json"); // Update the path accordingly

// mongoose.connect("mongodb://localhost:27017/your-database-name", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const saveStatesAndDistrictsToDB = async () => {
//   try {
//     // Iterate through states and insert into MongoDB
//     for (const stateName in jsonData) {
//       const state = await State.create({ stateName });
//       const districts = jsonData[stateName];

//       // Iterate through districts and insert into MongoDB
//       for (const districtName of districts) {
//         await District.create({
//           districtName,
//           stateName: state._id, // Reference the state ID
//         });
//       }
//     }

//     console.log("States and districts inserted successfully");
//   } catch (error) {
//     console.error("Error inserting states and districts:", error.message);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// saveStatesAndDistrictsToDB();
