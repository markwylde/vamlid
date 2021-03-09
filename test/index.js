const test = require('basictap');

const vamlid = require('../');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('check schema sync - invalid', t => {
  t.plan(1);

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

  const expected = {
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
  };

  const result = vamlid(schema, {
    email: 'wrong',
    notHere: 'test'
  });

  t.deepEqual(expected, result);
});

test('check schema sync - valid', t => {
  t.plan(1);

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

  const result = vamlid(schema, {
    email: 'test@example.com',
    password: 'success'
  });

  t.equal(result, undefined);
});

test('check schema async - invalid', async t => {
  t.plan(1);

  const schema = {
    email: [
      async value => sleep(10).then(() => 'invalid'),
      value => !value && 'is required',
      value => value && !value.includes('@') && 'should contain an @ symbol'
    ],

    password: [
      value => !value && 'is required',
      value => value && value.length < 5 && 'should be greater than 5 characters'
    ]
  };

  const expected = {
    fields: {
      email: [
        'invalid',
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
  };

  const result = await vamlid.async(schema, {
    email: 'wrong',
    notHere: 'test'
  });

  t.deepEqual(expected, result);
});

test('check schema async - valid', async t => {
  t.plan(1);

  const schema = {
    email: [
      async value => sleep(10).then(() => undefined),
      value => !value && 'is required',
      value => value && !value.includes('@') && 'should contain an @ symbol'
    ],

    password: [
      value => !value && 'is required',
      value => value && value.length < 5 && 'should be greater than 5 characters'
    ]
  };

  const result = await vamlid.async(schema, {
    email: 'test@example.com',
    password: 'success'
  });

  t.equal(result, undefined);
});

test('check schema async - nested empty array valid', async t => {
  t.plan(1);

  const schema = {
    email: [
      async value => sleep(10).then(() => undefined),
      value => !value && 'is required',
      value => value && !value.includes('@') && 'should contain an @ symbol'
    ],

    password: [
      value => !value && 'is required',
      value => value && value.length < 5 && 'should be greater than 5 characters'
    ],

    array: [
      value => value && [undefined, 2, undefined]
    ]
  };

  const result = await vamlid.async(schema, {
    email: 'test@example.com',
    password: 'success',
    array: true
  });

  t.deepEqual(result, {
    fields: {
      array: [
        [
          undefined,
          2,
          undefined
        ]
      ]
    },
    messages: []
  }
  );
});
