import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
// 無法 在controller這邊傳遞參數給recipeView, 因為object是在recipeView中建立的
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling all others 支援舊版瀏覽器
import 'regenerator-runtime/runtime'; // polyfilling async/await 支援舊版瀏覽器

// 允許在應用程序運行時替換、添加或刪除模組，而無需重新載入整個頁面或應用程序。這在開發過程中對於快速檢查更改的效果非常有用。

// if (module.hot) {
//   module.hot.accept();
// }

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // 載入特效
    if (!id) return;
    recipeView.renderSpinner();

    // 1. 更新 搜尋結果 不閃爍
    resultsView.update(model.getSearchResultsPage());

    // 2. 載入API資料
    await model.loadRecipe(id);
    // const recipe = model.state.recipe

    // 3. 渲染食譜
    recipeView.render(model.state.recipe);

    // 4. 更新書籤的頁面
    // debugger;
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. 從 View 找到 form輸入值
    const query = searchView.getQuery();
    if (!query) return;

    // 2. 傳入輸入值到model
    await model.loadSearchResults(query);

    // 3. render results
    resultsView.render(model.getSearchResultsPage());

    // 4. render initial pagination buttons
    paginationView.render(model.state.search);
    console.log('測試');
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. 渲染 新的結果（ 下一頁 /上一頁 ）
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. 渲染 新的分頁按鈕
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. 新增/刪除 書籤
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. 渲染 食譜的畫面
  recipeView.update(model.state.recipe);

  // 3. 渲染 右上角書籤的畫面
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = async function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💣', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
