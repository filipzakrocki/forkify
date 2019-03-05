import axios from 'axios';
import {key, proxy} from '../config.js';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (err) {
            console.log(err);
            alert('Something went wrong :(')
    }
    }
    
    calcTime() {
        //Assuming each 3 ingredients will take 15 mins to process to arrive at average preparation time
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }
    
    calcServings() {
        // not assuming anything
        this.servings = 4;
    }
 }