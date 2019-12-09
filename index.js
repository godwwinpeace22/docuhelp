
const md = require('markdown-it')()
const Fuse = require('fuse.js')
const createMarkup = require('./createMarkup')

function DocuHelp (opts){

  if(!(this instanceof DocuHelp)){
    return new DocuHelp(opts)
  }
  
    let {
      headerText="Instant Answers",
      articles=[],
      sortOptions={
        order: 'asc',
        sort_field: 'weight'
      },
      searchOptions={}
    } = opts

    this.opts = {
      headerText,
      articles,
      sortOptions,
      searchOptions
    }
    
    this.parseMarkdown = function(opts){
      if(!Array.isArray(opts.articles)) throw new Error('articles must be an array of objects')

      let articles = opts.articles.map((article, i) =>{
        let rendered = md.render(article.body);
        let plainBody = this.toPlainText(rendered)
        return {
          ...article,
          body: rendered,
          id: `${article.title.split(' ').join('-')}-${i}`,
          plainBody,
          excerpt: this.truncateText(plainBody, 200)
        }
      })

      return this.sortArticles(articles)

    }

    this.toPlainText = function(html){
      html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
      html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
      html = html.replace(/<\/div>/ig, '\n');
      html = html.replace(/<\/li>/ig, '\n');
      html = html.replace(/<li>/ig, '  *  ');
      html = html.replace(/<\/ul>/ig, '\n');
      html = html.replace(/<\/p>/ig, '\n');
      html = html.replace(/<br\s*[\/]?>/gi, "\n");
      html = html.replace(/<[^>]+>/ig, '');
      return html
    }

    this.sortArticles = (articles) => {
      
      let {sort_field, order} = this.opts.sortOptions

      function compare(a, b) {

        if(!a.hasOwnProperty(sort_field) || !b.hasOwnProperty(sort_field)){
          return 0
        }
        
        const item1 = typeof a[sort_field] === 'string' ? a[sort_field].toUpperCase() : a[sort_field]
        const item2 = typeof b[sort_field] === 'string' ? (b[sort_field]).toUpperCase() : b[sort_field]
      
        let index = 0;
        if (item1 > item2) {
          index = 1;
        } else if (item1 < item2) {
          index = -1;
        }
        return order === 'desc' ? index * -1 : index
      }

      return articles.sort(compare)
    }

    this.truncateText = function(text, length=18){
      return typeof text === 'string' ?
        text.length > length ?
        text.substr(0, length) + '...' :
        text : text
    }

    this.opts.articles = this.parseMarkdown(this.opts)
    
    this.searchArticles = function(search_term=''){
      return this.fuse.search(search_term)
    }


    DocuHelp.prototype.mount = function(){

      let markup = createMarkup(this.opts)
      
      document.body.innerHTML = markup

      let _button = document.getElementById('dh-button')
      let _back_button = document.getElementById('dh-back-button')
      let _cancel_button = document.getElementById('dh-cancel-button')
      let _frame = document.getElementById('dh-frame')
      let _cards = document.getElementsByClassName('dh-content-card')
      let _search = document.getElementById('dh-search')

      _button.addEventListener('click', (e) => {
        
        _frame.classList.contains('hidden') ?
        this.openWidget() :
        this.closeWidget()

      })

      // button to clear search results
      _cancel_button.addEventListener('click', (e) => {
        
        this.opts.articles.map(article => {
          document.getElementById(article.id).classList.remove('hidden')
        })

        _cancel_button.classList.add('hidden')

      })

      // attach listeners to each card
      for(let _card of _cards){
        
        _card.addEventListener('click', (e)=>{
          
          let articleId = _card.getAttribute('id')
          let article = this.opts.articles.find(item => item.id == articleId)
          
          this.openArticle(article, articleId)
        })
      }


      // initialize search
      let options = {
        searchText: 'Search docs - press enter to search',
        shouldSort: true,
				threshold: 0.4,
				tokenize: true,
        matchAllTokens: true,
        keys: ['title','plainBody'],
        ...this.opts.searchOptions
      }
      this.fuse = new Fuse(this.opts.articles, options)

      // atach event listener to search input
      _search.addEventListener('keyup', (e) => {
        if(e.keyCode == '13'){
          e.preventDefault()
          
          let search_term = e.target.value
          if(!search_term) return 
          let search_result = this.searchArticles(search_term)
          
          // show matches only
          this.opts.articles.map(article => {
            document.getElementById(article.id).classList.remove('hidden')
          })

          for (const item of this.opts.articles) {
            
            let found = search_result.find(a => a.id == item.id)
            if(!found){
              document.getElementById(item.id).classList.add('hidden')
            }
          }

          // show cancel button
          _cancel_button.classList.remove('hidden')
          _back_button.classList.add('hidden')
        }

      })
      

    }


    DocuHelp.prototype.destroy = function(){
      let elem = document.getElementById('dh-wrapper')
      document.body.removeChild(elem)
      return this
    }

    DocuHelp.prototype.openArticle = function(article){

      let _article_container = document.getElementById('dh-content-card-open')

      let contentCard = `
          <div class="dh-content-card__title">
            
          ${article.title}
          </div>
          <div class="dh-content-card__body">
            ${article.body}
          </div>
        
        `

      _article_container.innerHTML = contentCard
      _article_container.classList.remove('hidden')
      _article_container.classList.remove('fadeOutDown')
      _article_container.classList.add('fadeInDown')

      // toggle back button visibility
      let _back_button = document.getElementById('dh-back-button')
      _back_button.classList.toggle('hidden')

      // hide article
      _back_button.addEventListener('click', e=>{
        _back_button.classList.toggle('hidden')
        
        e.stopImmediatePropagation()

        _article_container.classList.remove('fadeInDown')
        _article_container.classList.add('fadeOutDown')
        setTimeout(() => {
          _article_container.classList.add('hidden')
        }, 500); 
      })

      return this
    }

    DocuHelp.prototype.openWidget = function(){
      let elem = document.getElementById('dh-frame')
      elem.classList.add('fadeInUp')
      elem.classList.remove('fadeOutDown')
      elem.classList.remove('hidden')
      return this
    }


    DocuHelp.prototype.closeWidget = function(){
      let elem = document.getElementById('dh-frame')

      elem.classList.add('fadeOutDown')
      elem.classList.remove('fadeInUp')

      setTimeout(() => elem.classList.add('hidden'), 1000)
      
      return this
    }



  
}

window.DocuHelp = DocuHelp
module.exports = DocuHelp


