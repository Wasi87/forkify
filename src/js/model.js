import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';
//loadRecipe更新食譜，輸出到controller
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    // 因為getJSON是非同步function，回傳是一個Promise，所以要用await去存resolved promise
    const data = await getJSON(`${API_URL}/${id}`);

    let { recipe } = data.data; //同等於let recipe = data.data.recipe

    //重新定義object裡面的key名稱
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    // else state.recipe.bookmarked = false;

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // temp error handling
    console.error(`💣💣💣💣`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`💣💣💣💣`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * 10; // 0
  const end = page * state.search.resultsPerPage; // 10
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // 加入書籤
  state.bookmarks.push(recipe);

  // 標籤目前食譜
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
