async function vamlid (schema, data) {
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

  const validValues = Object
    .keys(schema)
    .map(async key => {
      const schemaCheckResultPromises = schema[key]
        .map(validator => {
          return validator(data[key], data);
        });

      const schemaCheckResults = await Promise.all(schemaCheckResultPromises);
      schemaCheckResults
        .filter(key => !!key)
        .forEach(message => {
          result.fields[key] = result.fields[key] || [];
          result.fields[key].push(message);
        });
    })
    .flat();

  await Promise.all(validValues);

  if (result.messages.length > 0 || Object.keys(result.fields).length > 0) {
    return result;
  }
}

module.exports = vamlid;
