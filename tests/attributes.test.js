import Attributes from '../src/Attributes.js';

test(
  'Tests the constructor of the Attributes class.',
  () => {
    let attributes = new Attributes({ class: ['example-class'] });
    expect(!!attributes.class).toBe(true);
    expect(attributes.class).toEqual(['example-class']);

    // Test adding boolean attributes through the constructor.
    attributes = new Attributes({ selected: true, checked: false })
    expect(attributes.selected).toBe(true);
    expect(attributes.checked).toBe(false);
    expect(attributes.toString()).toEqual(' selected');

    attributes = new Attributes({ class: 'example-class' });
    expect(!!attributes.class).toBe(true);
    expect(attributes.class).toEqual(['example-class']);

    attributes = new Attributes({ class: 'example-class example-class--variant' });
    expect(attributes.class).toEqual(['example-class', 'example-class--variant']);
  }
);

test(
  'Tests set of values.',
  () => {
    let attributes = new Attributes();
    attributes.class = 'example-class';
    expect(!!attributes.class).toBe(true);
    expect(attributes.class).toEqual(['example-class']);
  }
)

test(
  'Tests adding new values to an existing part of the attribute.',
  () => {
    let attributes = new Attributes({class: ['example-class']});
    attributes.class.push('other-class');
    expect(attributes.class).toEqual(['example-class', 'other-class']);
  }
)

test(
  'Tests removing of values.',
  () => {
    let attributes = new Attributes({class: ['example-class']});
    delete attributes.class;
    expect(typeof attributes.class).toEqual('undefined');
  }
)
