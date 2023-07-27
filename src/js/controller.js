// name export, default export
import { async } from 'regenerator-runtime';
import * as model from './model.js';
// 無法 在contoller這邊傳遞參數給recipeView, 因為object是在recipeView中建立的
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable'; //polyfilling all others 支援舊版瀏覽器
import 'regenerator-runtime/runtime'; //polyfilling async/await 支援舊版瀏覽器

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

    // 1. 載入API資料
    await model.loadRecipe(id);
    // const recipe = model.state.recipe

    // 2. 渲染食譜
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    console.error(`🦀🦀🦀🦀🦀🦀${err}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. 從View找到form輸入值
    const query = searchView.getQuery();
    if (!query) return;

    // 2. 傳入輸入值到model
    await model.loadSearchResults(query);

    // 3. render results
    resultsView.render(model.getSearchResultsPage());
  } catch (err) {
    console.log(err);
  }
};
// controlRecipes(); 改到下面訂閱模式

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();

//改寫成這樣
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe); //複製貼上網址沒辦法到那個網頁
