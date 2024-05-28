# Welcome to Forkify

> 🤡 This is a practice project based on [Jonas's Javascript course](https://github.com/jonasschmedtmann/complete-javascript-course).

## Intro 

Forkify is a recipe web app that allows users to search, bookmark, and add your recipes URL links by using Forkify API.

## Installation

```
GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/Wasi87/forkify.git
npm install
npm run start
```

To add your personal recipe, plase generate your own API key from [Forkify API](https://forkify-api.herokuapp.com/v2), and place it in `config.js` file.

```
export const KEY = '<YOUR KEY>';
```


## Feature

* Query your desired ingredient or dish to retrieve a list of recipes with [supported search terms](https://forkify-api.herokuapp.com/phrases.html). 
* Adjust the servings of a recipe to proportionally calculate the required ingredients.
* Bookmark and unbookmark your selected recipes.
* Create your own recipes, which are identifiable by a personal icon.
* Utilize LocalStorage to store and retain your data.

## Demo


[Click me to try! 🔪🔪🔪](https://forkify-tina.netlify.app/)

![](readme.assets/forkify.gif)
