# Type-ahead #
Type ahead library with a lot of options including templates, limit, duplicate removal
## Features ##

<ul>
            <li><kbd>Strong templating</kbd></li>
            <li><kbd>Client side filtering</kbd></li>
            <li><kbd>Limit selections</kbd></li>
            <li><kbd>Duplicate removal</kbd></li>
            <li><kbd>Respond to events</kbd></li>
</ul>

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
                //Ajax source
        var ex2 = window.typeAhead.init({
            bind: 'txt-example-2',
            url: 'https://restcountries.eu/rest/v2/name/{#countryname#}',
            params: [{ name: 'countryname', value:()=>$('#txt-example-2').val()}],
            template: function (x) {
                return `<p>${x.name}</p>`;
            },
            tagMode: true,
            tag: {
                label: 'name'
            }
        });
```
