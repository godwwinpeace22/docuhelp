const DocuHelp = require('./index')

let opts = {
  headerText: 'Header title',
  articles: [
    {
      title: 'title one',
      body: '##lorem ipsume dolor sit amet con'
    },
    {
      title: 'title two',
      body: '#lorem ipsume dolor sit amet con ![link image](https://google.com)'
    }
  ]
}

let docuHelp = new DocuHelp(opts)

docuHelp.mount()