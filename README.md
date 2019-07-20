# Type-ahead #
Type ahead library with a lot of options including templates, limit, duplicate removal

## Dependencies ##

- Jquery v1.0 or above
- Bootstrap3 or above

## Examples ##

> Simple Usage 
```html
<input type="text" id="txt-example-1" class="form-control" placeholder="type country name" />
```
```javascript
var ex1 = window.typeAhead.init({
            bind: 'txt-example-1',
            source: ['India', 'USA', 'China', 'Australia', 'South Korea', 'Japan', 'United kingdom'],
            template: x => `<p>${x}</p>`,
            tagMode: true,
        });
```
> From ajax source 
```html
<input type="text" id="txt-example-2" class="form-control" placeholder="type country name" />
```
```javascript
        var ex2 = window.typeAhead.init({
            bind: 'txt-example-2',
            url: '/countries.json',
            template: function (x) {
                return `<p>${x.name} - ${x.code}</p>`;
            },
            tagMode: true,
            tag: {
                label: 'name'
            }
        });
```
