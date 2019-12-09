# Docuhelp  [![GitHub issues](https://img.shields.io/github/issues/godwwinpeace22/docuhelp)](https://github.com/godwwinpeace22/docuhelp/issues) [![GitHub license](https://img.shields.io/github/license/godwwinpeace22/docuhelp)](https://github.com/godwwinpeace22/docuhelp/blob/master/LICENSE)

Docuhelp is simple and beautiful knowledge Base widget in javascript that lets you write your docs in Markdown format and easily include it into your website or apps.

Docuhelp is backend agnostic. You can have all your docs on the client-side without having to deal with any server or database.
## Demo 
[See live demo](https://docuhelpdemo.netlify.com)
## Installation

NPM

```bash
$ npm install docuhelp --save
```

##### CDN
[cdn](https://unpkg.com/docuhelp/dist/), then include the script tags


## Usage

```javascript
import DocuHelp from 'docuhelp'

// showing all the default options, all of which are optional except 'articles'
var options = {
  headerText: 'Instant Answers',
  articles: [
    {
      title: 'Article 1',
      body: '## this is a markdown',
      weight: 10 // used for sorting - bigger numbers have more 'weight'
    },
    {
      title: "Article 2",
      body: "[Link]('https://example.com')",
      weight: 5 // will be below 'Article 1'
    }
  ],
  sortOptions: {
    order: 'asc', // Or 'desc' - to sort in ascending or descending order
    sort_field: 'weight' // field articles are sorted by
  },
  searchOptions: {
    // Fuse.js options
  }
}

var docuhelp = new DocuHelp(options)
docuHelp.mount()
```
Docuhelp uses [Fuse.js](https://github.com/krisk/Fuse) to perform fulltext-search. Check the [documentation](https://fusejs.io/) to learn more about the available options.


### Options
| option        | Type          |  description 
| ------------- |:-------------:| -----:
| `headerText`  | `String`     | The text on the header |
| `articles`    | `Array`      | Array of objects of the docs   |
| `sortOptions` | `Object`     | Sort options       |
| `searchOptions` | `Object`   |search options   |


## API
#### `.mount()`
Mounts the widget to the DOM, attaches event listeners

#### `.openWidget()`
Opens the widget frame. Widget still mounted.
#### `.closeWidget()`
Close the wdiget frame
#### `.destroy()`
Unmount the widget from the DOM and detach all event handlers.

## Dealing with bigger articles
In the case where your articles are too big such that it's not convenient to directly insert them into the `articles` array, you could save each article as `.md` documents, read the file then pass it into the `articles` array.
#### For Example (Node.js): 

```javascript
const fs = require('fs');
const doc1 = require('path/to/doc1.md');
let doc1Buffer = fs.readFileSync(doc1)

// then use it as usual:
...
let options = {
  ...
  articles: [
    {
     title: 'doc1 title',
     body: doc1Buffer.toString(),
     weight: 10
    }

]

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
MIT