;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.JSONToTypeScript = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function toPascalCase(str) {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, function (m, chr) { return chr.toUpperCase(); })
              .replace(/^[a-z]/, function (chr) { return chr.toUpperCase(); });
  }

  function getType(val, keyName, interfaces) {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    const t = typeof val;
    if (t === 'string') return 'string';
    if (t === 'number') return 'number';
    if (t === 'boolean') return 'boolean';

    if (Array.isArray(val)) {
      if (!val.length) return 'any[]';
      const itemTypes = Array.from(new Set(val.map(function (item) { return getType(item, keyName + 'Item', interfaces); })));
      if (itemTypes.length === 1) return itemTypes[0] + '[]';
      return '(' + itemTypes.join(' | ') + ')[]';
    }

    if (t === 'object') {
      const ifaceName = toPascalCase(keyName || 'RootObject');
      const props = [];
      for (const k in val) {
        if (!Object.prototype.hasOwnProperty.call(val, k)) continue;
        const pType = getType(val[k], k, interfaces);
        props.push('  ' + k + ': ' + pType + ';');
      }
      interfaces[ifaceName] = 'export interface ' + ifaceName + ' {\n' + props.join('\n') + '\n}';
      return ifaceName;
    }
    return 'any';
  }

  function convert(jsonInput, rootName) {
    rootName = rootName || 'Root';
    let data = jsonInput;
    if (typeof jsonInput === 'string') data = JSON.parse(jsonInput);

    const interfaces = {};
    const rootType = getType(data, rootName, interfaces);

    let output = Object.values(interfaces).join('\n\n');
    if (Array.isArray(data)) {
      output += '\n\nexport type ' + toPascalCase(rootName) + 'List = ' + rootType + ';';
    }
    return output.trim();
  }

  return { convert: convert, toPascalCase: toPascalCase };
});
