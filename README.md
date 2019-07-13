# type-ahead #
Type ahead library with a lot of options including templates, limit, duplicate removal

## Dependencies ##

- Jquery v1.0 or above
- Bootstrap3 or above

# Examples #

> Simple Usage 
```javascript
  var products = new Bloodhound({
    datumTokenizer: function(d) {return d.name; },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: 'http://localhost/dh/js/products.json'


  });


  products.initialize();

  $('.test1').typeahead({
    highlight: true
  },
  {
    name: 'products',
    displayKey: 'num',
    source: states.ttAdapter()

  });
```
