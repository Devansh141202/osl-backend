const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    module: [
      {
        moduleName: {
          type: String,
        },
        task: [
          {
            taskName: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now(),
            },
            researchHour: {
              type: Number,
            },
            developmentHour: {
              type: Number,
            },
            meetingHour: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("logs", logSchema);
