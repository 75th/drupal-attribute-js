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
    expect(attributes.toString()).toBe(' selected');

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
