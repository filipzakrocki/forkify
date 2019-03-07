//models
import Search from './models/Search';
import Recipe from './models/Recipe';

//views
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

//global state
// 1. search object
// 2. current recipe
// 3. shopping list
// 4. liked recipes

const state = {};

// *** SEARCH CONTROLLER***

const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput(); //todo
    
    // new search
    if (query) {
        // new searcg object add it to state
        state.search = new Search(query);
        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        // search for recipes
        try {
            await state.search.getResults();
            
            // render the results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            console.log(err);
            clearLoader();
        }
        
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }
});


// ***RECIPE CONTROLLER***

const controlRecipe = async () => {
    // Getting a hash (id) from URL
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //highlight selected
        if (state.search) searchView.highlightSelected(id);
        
        // Create new recipe object
        state.recipe = new Recipe(id);
        
        // Get recipe data
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // call calctime and servings
            state.recipe.calcServings();
            state.recipe.calcTime();
            
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        } catch (err) {
            alert('Didnt get a valid ID :C')
    }
        
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));