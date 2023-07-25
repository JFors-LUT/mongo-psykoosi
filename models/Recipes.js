const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recipeSchema = new Schema ({
    name: String,
    instructions: Array,
    ingredients: Array,
    categories: Array
});

module.exports = mongoose.model("Recipes", recipeSchema)