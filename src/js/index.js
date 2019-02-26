//models
import Search from './models/Search';

//views
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';

//global state
// 1. search object
// 2. current recipe
// 3. shopping list
// 4. liked recipes

const state = {};

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
        await state.search.getResults();
        
        // render the results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});