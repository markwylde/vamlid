function vamlid (schema, data) {
  const result = {
    messages: [],
    fields: {}
  };

  Object
    .keys(data)
    .filter(key => !schema[key])
    .forEach(key => {
      result.fields[key] = result.fields[key] || [];
      result.fields[key].push('is not a valid key');
      result.messages.push(key + ' is not a valid key');
    });

  Object
    .keys(schema)
    .forEach(async key => {
      schema[key]
        .map(validator => {
          return validator(data[key], data);
        })
        .filter(key => !!key)
        .forEach(message => {
          result.fields[key] = result.fields[key] || [];
          result.fields[key].push(message);
        });
    });

  if (result.messages.length > 0 || Object.keys(result.fields).length > 0) {
    return result;
  }
}

module.exports = vamlid;
