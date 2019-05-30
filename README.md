# micro-frontends
example repo for micro frontends with react and dependency inversion as integration pattern

playground to learn how to integrate micro frontends, usages product and content search as example

Assume you have two ore more different search providers as e.g. product and content search. Both are
developed in different teams which want to develop and release their features independently. But you
have to integrate them in frontend like the following:

![alt search-example](_doc/search-example.png)

## Why?
To scale with multiple teams in a micro services environment

* Keep coupling low
* One-way dependency graph
* Specialized assets know general assets, but not vice versa

## Set up
````
yarn build

cd composer
yarn serve

cd search
yarn serve

cd product
yarn serve

cd content
yarn serve
````

Open http://localhost:8080 in web browser

## Architecture
### Components
Dependency graph without cycles

![alt components dependency](_doc/architecture.png)

### Sequence
#### Load HTML and JS
![alt load html and js](_doc/sequence_1.png)


#### Execute search with one product search provider
![alt execute search with one product search provider](_doc/sequence_2.png)


#### ... and add additional content search provider
![alt execute search with product and content search provider](_doc/sequence_3.png)


#### ... and if no results from any search provider, provide fallback with suggestions
![alt fallback with suggestions](_doc/sequence_4.png)

## Project structure

````
.
├── composer
│   └── server
├── content
│   ├── client
│   └── server
├── product
│   ├── client
│   └── server
├── search
│   ├── client
│   └── server
└── search-api
    ├── lib
    └── src
    
````

### search-api
interface to register different search providers with

* ID
* order
* execute_search
* execute_count
* getSearchTab
* getResultComponent

### search

* client
    * provides container stuff, like rendering search tabs or search results
    * calls search callback on active search provider
    * handles search errors, search fallback and merges suggestions from all search providers

* server
    * delivers client js, could be a CDN as well

### product

* client
    * provides components to render search results and search tabs
    * could implement filter and use fetchData callback to re-execute search

* server
    * delivers client js, could be a CDN as well
    * could provide REST-API in real world use case
    
### content
same as product

### composer

* server
    * central unit that receives browser request and return html document
    * includes all scripts
    * may or may not fetch initial data and could be used for server side rendering


## Slides
Uses [demoit](https://github.com/dgageot/demoit "demoit") and Go

1. Install [Go](https://golang.org/ "Go")
2. Start with ./demoit slides/demo

or use [PDF](slides/slides.pdf "pdf").

## ToDos
### Suspense/Loading optimization

### error handling
add example and test it

### layout
optimization, evt. remove react-bootstrap
