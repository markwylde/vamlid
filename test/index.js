import test from 'basictap';

import vamlid from '../index.js';

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
    messages: ['notHere is not a valid key'],
    fields: {
      notHere: ['is not a valid key'],
      email: ['should contain an @ symbol'],
      password: ['is required']
    }
  };

  const result = vamlid.sync(schema, {
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

  const result = vamlid.sync(schema, {
    email: 'test@example.com',
    password: 'success'
  });

  t.equal(result, undefined);
});

test('check schema async - invalid', async t => {
  t.plan(1);

  const schema = {
    email: [
      async () => sleep(10).then(() => 'invalid'),
      value => !value && 'is required',
      value => value && !value.includes('@') && 'should contain an @ symbol'
    ],

    password: [
      value => !value && 'is required',
      value => value && value.length < 5 && 'should be greater than 5 characters'
    ]
  };

  const expected = {
    messages: ['notHere is not a valid key'],
    fields: {
      notHere: ['is not a valid key'],
      password: ['is required'],
      email: ['invalid', 'should contain an @ symbol']
    }
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
      async () => sleep(10).then(() => undefined),
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
      async () => sleep(10).then(() => undefined),
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
    messages: [],
    fields: {
      array: [
        [
          undefined,
          2,
          undefined
        ]
      ]
    }
  }
  );
});
