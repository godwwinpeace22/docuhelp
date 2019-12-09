create = function(data){
  
  let contentCard = data.articles.map(item => {
    return `<div class="dh-content-card" id="${item.id}">
      <div class="dh-content-card__title">
        ${item.title}
      </div>
      <div class="dh-content-card__body">
        ${item.excerpt}
      </div>
    </div>
    `
  })
  
  let htmlString = `
  
    <div class="dh-wrapper" id="dh-wrapper">
      <div class="dh-frame hidden" id="dh-frame">
        <div class="dh-header">
          <span id="dh-back-button" class="hidden">&larr;</span>
          <span id="dh-cancel-button" class="hidden">&larr;</span>
          <div class="dh-header-title">${data.headerText}</div>
        </div>
        <div class="dh-content scrollbar" id="dh-content">
          <div id="dh-content-list">
            ${contentCard.join(' ')}
          </div>

          <div id="dh-content-card-open" class="scrollbar hidden"></div>
        
        </div>
        <div class="dh-footer">
          <input type="text" id="dh-search" placeholder="${data.searchOptions.searchText}">
        </div>
      </div>
      <div class="dh-button" id="dh-button">
        <span>X</span>
      </div>
    </div>
  `

  return htmlString
}

module.exports  = create

