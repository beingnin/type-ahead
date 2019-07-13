# type-ahead #
Type ahead library with a lot of options including templates, limit, duplicate removal

## Dependencies ##

- Jquery v1.0 or above
- Bootstrap3 or above

# Examples #

> Simple Usage 
```javascript
var ex1 = window.typeAhead.init({
            bind: 'txt-example-1',
            source: ['India', 'USA', 'China', 'Australia', 'South Korea', 'Japan', 'United kingdom'],
            template: x => `<p>${x}</p>`,
            tagMode: true,
        });
```
