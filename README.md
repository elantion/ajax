[deprecated]: AJAX is so simple, you don't need a module to help you at all.
# ajax
A XMLHttpRequest 2 module

## Usage
Just like any other npm module.
### install
simply
```bash
npm install lc-ajax --save
```

### import
JavaScript
```javascript
const Ajax = require('lc-ajax');
```
TypeScript
```typescript
import Ajax = require('lc-ajax');
```

### use
```typescript
Ajax.get(url, data, headers);
Ajax.post(url, data, headers, enctype);
```
