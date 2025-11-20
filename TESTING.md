# Testing Vue 2 Components

This project uses Jest to test Vue 2 components with a custom structure (`.js` and `.tpl` files).

## Setup

The testing infrastructure includes:

- **`jest.config.js`** - Jest configuration for Vue component testing
- **`test-setup.js`** - Global test setup with helpers for loading `.tpl` templates
- **`babel.config.js`** - Babel configuration for transpiling JavaScript
- **`package.json`** - NPM scripts for running tests

## Running Tests

### Install Dependencies

First, install the required dependencies:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Component Test

To run the badge component test specifically:

```bash
npm run test:badge
```

Or use Jest directly:

```bash
npx jest v2/component/public/bundled/views/badge/badge.spec.js
```

## Writing Tests for Custom Vue Components

### Component Structure

Vue components in this project follow a custom structure:

- **`component.js`** - Component logic and configuration
- **`component.tpl`** - Component templates (HTML)

### Test File Structure

Test files should be named `component.spec.js` and placed in the same directory as the component.

### Example Test

Here's a basic example of testing a component:

```javascript
const path = require('path');
const Vue = require('vue');

describe('my-component', () => {
  beforeAll(() => {
    // Load the template file
    const templatePath = path.join(__dirname, 'my-component.tpl');
    const templates = loadTemplate(templatePath);
    
    // Register templates in the DOM
    registerTemplates(templates);
    
    // Mock Vue.view if needed
    if (!Vue.view) {
      Vue.view = function(name, options) {
        Vue.component(name, options);
      };
    }
    
    // Load the component
    require('./my-component.js');
  });
  
  it('should register the component', () => {
    const component = Vue.options.components['my-component'];
    expect(component).toBeDefined();
  });
  
  it('should render correctly', (done) => {
    const Constructor = Vue.extend(Vue.options.components['my-component']);
    const vm = new Constructor({
      propsData: {
        // Your props here
      }
    });
    
    vm.$services = mockServices;
    vm.$mount();
    
    Vue.nextTick(() => {
      expect(vm.$el).toBeDefined();
      done();
    });
  });
});
```

### Available Test Helpers

The `test-setup.js` file provides several global helpers:

- **`loadTemplate(templatePath)`** - Loads and parses a `.tpl` file
- **`registerTemplates(templates)`** - Registers templates in the DOM
- **`mockServices`** - Mock services object with common service methods
- **`$window`** - Mock window object with application configuration

### Testing Different Aspects

The example test in `v2/component/public/bundled/views/badge/badge.spec.js` demonstrates how to test:

1. **Component Registration** - Verify components are registered correctly
2. **Props** - Test required and optional props
3. **Metadata** - Check component name, category, description, etc.
4. **Lifecycle Hooks** - Test created, ready, and other lifecycle methods
5. **Methods** - Test component methods
6. **Computed Properties** - Test computed properties with different states
7. **Rendering** - Test component rendering with different prop combinations

## Tips

- Use `done()` callback in async tests (especially for rendering tests)
- Mock `$services` and other dependencies as needed
- Use `Vue.nextTick()` when testing DOM updates
- Keep tests focused on one aspect at a time
- Use descriptive test names that explain what is being tested

## Troubleshooting

### Template Not Found

If you get "template not found" errors, ensure:
- The `.tpl` file exists in the same directory as the component
- The template ID in the `.tpl` file matches the component name
- Templates are registered before loading the component JavaScript

### Services Not Defined

If you get "service not defined" errors:
- Check that `mockServices` includes the required service
- Add missing services to `test-setup.js`
- Ensure `vm.$services = mockServices` is called before mounting

### Component Not Registered

If the component is not found:
- Ensure `Vue.view` is mocked before loading the component
- Check that the component JavaScript file is loaded in `beforeAll`
- Verify the component name matches what you're testing
