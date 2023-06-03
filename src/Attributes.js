
// JavaScript enum pattern from https://masteringjs.io/tutorials/fundamentals/enum.
const createEnum = values => {
  const enumObject = {};

  for (const val of values) {
    enumObject[val] = val;
  }
  return Object.freeze(enumObject);
};

const escapeMap = new Map([
  ["'", ['&#39;']],
  ['"', ['&quot;', '&#34;']],
  ['<', ['&lt;', '&#60;']],
  ['&', ['&amp;', '&#38;']],
  ['>', ['&gt;', '&#62;']],
]);

const escapeAttribute = text => {
  escapeMap.forEach((escapes, orig) => {
    text = text.replaceAll(orig, escapes[0]);
  })

  return text;
};

const unescapeAttribute = text => {
  escapeMap.forEach((escapes, orig) => {
    escapes.forEach((escape) => {
      text = text.replaceAll(escape, orig)
    });
  });

  return text;
};

const Operation = createEnum(['Add', 'Remove', 'Set']);

export default class Attributes {
  #attributes = new Map();

  // Hat tip: https://meiert.com/en/blog/boolean-attributes-of-html/.
  #booleans = [
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
  ];

  constructor(attrs) {
    for (const attr in attrs) {
      this.setAttribute(attr, attrs[attr]);
    }

    return new Proxy(this, {
      set(target, property, value) {
        target.setAttribute(property, value);
        return true;
      },
      get(target, propertyName) {
        const property = target[propertyName];
        return (typeof property === 'function') ? property.bind(target) : target.getAttribute(propertyName);
      }
    });

  }

  #deleteAttributeValue(oldValues, value) {
    let i = oldValues.indexOf(value);

    if (i === -1) {
      return oldValues;
    }

    oldValues.splice(i, 1);

    return oldValues;
  }

  #parseValues(values) {
    if (Array.isArray(values)) {
      // Coerce every value to a string using the String() object.
      return values.map(String);
    }

    if (typeof values !== 'string') {
      values = String(values);
    }

    return values.split(' ');
  }

  #parseBooleanValue(value) {
    if (typeof value === 'boolean') {
      return value;
    }

    if (!value || value.toLowerCase() === 'false') {
      return false;
    }

    return true;
  }

  #mutateAttribute(attr, op, newValues) {
    if (this.#booleans.indexOf(attr) !== -1) {
      this.#mutateBooleanAttribute(attr, op, newValues)
      return;
    }

    this.#mutateStringAttribute(attr, op, newValues);
  }

  #mutateBooleanAttribute(attr, op, newValue) {
    const self = this;

    switch (op) {
      case Operation.Add:
        newValue = true;
        break;
      case Operation.Set:
        newValue = this.#parseBooleanValue(newValue);
        break;
      case Operation.Remove:
        newValue = false;
        break;
    }

    self.#attributes.set(attr, newValue);
  }

  #mutateStringAttribute(attr, op, newValues) {
    const self = this;
    // Get unescaped old values if we're adding to/removing from them; disregard old values if we're using the Set operation.
    const oldValues = (!this.#attributes.get(attr) || op === Operation.Set) ? [] : this.#attributes.get(attr).map(unescapeAttribute);

    // Get an array of values no matter what we were given.
    newValues = this.#parseValues(newValues);

    newValues.forEach(value => {
      // Make acceptable
      value = escapeAttribute(value);

      switch (op) {
        case Operation.Add:
        case Operation.Set:
          oldValues.push(value);
          break;
        case Operation.Remove:
          this.#deleteAttributeValue(oldValues, value);
          break;
      }

      self.#attributes.set(
        attr,
        oldValues.filter((value, index, oldValues) => {
          return oldValues.indexOf(value) === index;
        })
      );
    });

    for (let i = 0; i < newValues.length; i++) {
      let value = newValues[i];

      if (typeof value !== 'string') {
        continue;
      }
    }
  }

  addClass(classes) {
    this.#mutateAttribute('class', Operation.Add, classes);

    return this;
  }

  removeClass(classes) {
    this.#mutateAttribute('class', Operation.Remove, classes);

    return this;
  }

  setAttribute(attr, values) {
    this.#mutateAttribute(attr, Operation.Set, values);

    return this;
  }

  hasClass(targetClass) {
    return this.#attributes.get('class').indexOf(targetClass) !== -1;
  }

  getAttribute(attr) {
    return this.#attributes.get(attr);
  }

  #attributeValueToString(attr) {
    if (this.#attributes.get(attr)) {
      return this.#attributes.get(attr).join(' ');
    }

    return '';
  }

  #entireAttributeToString(attr) {
    const value = this.#attributes.get(attr);
    // For a truthy boolean attribute, return just the attribute name.
    if (this.#booleans.indexOf(attr) !== -1) {
      return attr;
    }

    if (value) {
      return `${attr}="${this.#attributeValueToString(attr)}"`
    }

    return '';
  }

  toString() {
    const self = this;
    let output = '';

    self.#attributes.forEach((value, attr) => {
      if (value) {
        output += ' ' + self.#entireAttributeToString(attr);
      }
    });

    return output;
  }
}
