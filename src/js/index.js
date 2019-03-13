//models
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

// base elements
import {elements, renderLoader, clearLoader} from './views/base';
//views
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

// global state
// 1. search object
// 2. current recipe
// 3. shopping list
// 4. liked recipes

const state = {};
window.state = state;

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        } catch (err) {
            alert('Didnt get a valid ID :C')
            console.log(err);
    }
        
    }
}

// LIST CONTROLLER

const controlList = () => {
    if (!state.list) state.list = new List();
    
    //Add each ingredient
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
    
}

//handle delete and update list item events

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    if (e.target.matches('shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});


// LIKE CONTROLLER
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    
    const currentID = state.recipe.id;
    if (!state.likes.isLiked(currentID)) {
        //user has not yet liked
        // add the like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        
        //toggle like button
        likesView.toggleLikeBtn(true);
        
        
        //Add like to UI
        likesView.renderLike(newLike);
        
        
        
    } else {
        //remove from the states
        state.likes.deleteLike(currentID);
        
        // remove like button
        likesView.toggleLikeBtn(false);
        
        // remove it from UI
        likesView.deleteLike(currentID);
    }
    
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //like controller
        controlLike();
    }
    
    
})


// ** create new list element


