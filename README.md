# vamlid
A simple way to validate an object against a pure javascript schema.

## Installation
```bash
npm install --save vamlid
```

## Usage (sync)
```javascript
const vamlid = require('vamlid');

function validateUser (data) {
  const schema = {
    email: [
      value => !value && 'is required',
      value => value && !value.includes('@') && 'should contain an @ symbol'
    ],

    password: [
      value => !value && 'is required',
      value => value && value.length < 5 && 'should be greater than 5 characters'
    ]
  };

  return vamlid(schema, data);
}

const result = validateUser({
  email: 'wrong',
});

console.log(result)
/*
  [

  ]
*/
```

## Usage (async)
```javascript
const vamlid = require('vamlid/async');

function validateUser (data) {
  const schema = {
    email: [
      value => someDbProvider
        .find({ email: value })
        .then(() => 'Email already taken')
        .catch(() => false),
      value => !value && 'is required',
      value => value && !value.includes('@') && 'should contain an @ symbol'
    ],

    password: [
      value => !value && 'is required',
      value => value && value.length < 5 && 'should be greater than 5 characters'
    ]
  };

  return vamlid(schema, data);
}

const result = await validateUser({
  email: 'wrong',
});

console.log(result)
/*
  [

  ]
*/
```
