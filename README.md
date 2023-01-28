# vamlid
A simple way to validate an object against a pure javascript schema.

## Installation
```bash
npm install --save vamlid
```

## Usage (sync)
```javascript
import { sync as vamlid } from 'vamlid';

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
  notHere: 'test'
});

console.log(result)
/*
{
  fields: {
    email: [
      'should contain an @ symbol'
    ],
    password: [
      'is required'
    ],
    notHere: [
      'is not a valid key'
    ]
  },
  messages: [
    'notHere is not a valid key'
  ]
}
*/
```

## Usage (async)
```javascript
import { async as vamlid } from 'vamlid';

function validateUser (data) {
  const schema = {
    email: [
      value => someDbProvider
        .findAll({ email: value })
        .then((results) => results.length > 0 && 'already taken')
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
{
  fields: {
    email: [
      'already taken',
      'should contain an @ symbol'
    ],
    password: [
      'is required'
    ],
    notHere: [
      'is not a valid key'
    ]
  },
  messages: [
    'notHere is not a valid key'
  ]
}
*/
```
