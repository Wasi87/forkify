class SearchView {
  // 收search form輸入的文字
  // 監聽click活動
  _parentEl = document.querySelector('.search');

  getQuery() {
    // return this.#ParentEl.querySelector('.search__field').value;
    const query = this._parentEl.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }

  clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // pub-sub訂閱模式(訂閱者)
  addHandlerSearch(handler) {
    //在parentEl上監聽可以監聽按search按鈕和 enter!!
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); //controlSearchResults
    });
  }
}

export default new SearchView();
