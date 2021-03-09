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
        .filter(key => {
          if (!Array.isArray(key)) {
            return true;
          }

          const arrayIsEmpty = key.filter(item => !!item).length === 0;

          if (arrayIsEmpty) {
            return false;
          }

          return true;
        })
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
