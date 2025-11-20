/**
 * Example test for page-badge component
 * This demonstrates how to test Vue 2 components with custom .js and .tpl structure
 */

const path = require('path');
const Vue = require('vue');

// Component directory
const componentDir = __dirname;

function getComponentOptions(name = 'page-badge') {
    const component = Vue.options.components[name];
    if (component && component.options) {
        return component.options;
    }
    return component;
}

describe('page-badge component', () => {
    let templates;

    beforeAll(() => {
        // Load the template file
        const templatePath = path.join(componentDir, 'badge.tpl');
        templates = loadTemplate(templatePath);

        // Register templates in the DOM
        registerTemplates(templates);

        // Mock Vue.view helper used by the production bundle
        Vue.view = function (name, options) {
            if (!options.template) {
                options.template = `#${name}`;
            }
            Vue.component(name, options);
        };

        Vue.prototype.$services = mockServices;
        Vue.prototype.$window = $window;
        if (typeof Vue.prototype.getChildComponentClasses !== 'function') {
            Vue.prototype.getChildComponentClasses = () => '';
        }
        if (typeof Vue.prototype.$self === 'undefined') {
            Object.defineProperty(Vue.prototype, '$self', {
                get() {
                    return this;
                }
            });
        }

        // Load the component JavaScript file
        require('./badge.js');
    });

    beforeEach(() => {
        // Create a fresh Vue instance for each test
        document.body.innerHTML = '<div id="app"></div>';
    });

    describe('Component Registration', () => {
        it('should register the page-badge component', () => {
            const component = getComponentOptions();
            expect(component).toBeDefined();
        });

        it('should register the page-badge-configure component', () => {
            const component = getComponentOptions('page-badge-configure');
            expect(component).toBeDefined();
        });
    });

    describe('Component Props', () => {
        it('should have required props defined', () => {
            const component = getComponentOptions();

            expect(component.props.page).toBeDefined();
            expect(component.props.page.type).toBe(Object);
            expect(component.props.page.required).toBe(true);

            expect(component.props.cell).toBeDefined();
            expect(component.props.cell.type).toBe(Object);
            expect(component.props.cell.required).toBe(true);

            expect(component.props.edit).toBeDefined();
            expect(component.props.edit.type).toBe(Boolean);
            expect(component.props.edit.required).toBe(true);
        });

        it('should have optional props defined', () => {
            const component = getComponentOptions();

            expect(component.props.parameters).toBeDefined();
            expect(component.props.parameters.type).toBe(Object);
            expect(component.props.parameters.required).toBe(false);

            expect(component.props.childComponents).toBeDefined();
            expect(component.props.childComponents.type).toBe(Object);
            expect(component.props.childComponents.required).toBe(false);
        });
    });

    describe('Component Metadata', () => {
        it('should have correct metadata', () => {
            const component = getComponentOptions();

            expect(component.name).toBe('Badge');
            expect(component.category).toBe('Typography');
            expect(component.description).toBe('A badge');
            expect(component.icon).toBe('link');
        });
    });

    describe('Component Lifecycle', () => {
        it('should initialize elementPromise in created hook', () => {
            const component = getComponentOptions();
            const mockContext = {
                $services: mockServices
            };

            const createdHook = Array.isArray(component.created)
                ? component.created[component.created.length - 1]
                : component.created;

            expect(typeof createdHook).toBe('function');

            createdHook.call(mockContext);

            expect(mockContext.elementPromise).toBeDefined();
            expect(mockContext.elementPromise.resolve).toBeDefined();
        });
    });

    describe('Component Methods', () => {
        it('should have getContentWithVariables method', () => {
            const component = getComponentOptions();
            expect(component.methods.getContentWithVariables).toBeDefined();
            expect(typeof component.methods.getContentWithVariables).toBe('function');
        });

        it('should have getChildComponents method', () => {
            const component = getComponentOptions();
            expect(component.methods.getChildComponents).toBeDefined();
            expect(typeof component.methods.getChildComponents).toBe('function');
        });

        it('should return correct child components', () => {
            const component = getComponentOptions();
            const result = component.methods.getChildComponents();

            expect(result).toEqual([{
                title: 'Badge',
                name: 'page-badge',
                component: 'badge'
            }]);
        });

        it('should have configurator method', () => {
            const component = getComponentOptions();
            expect(component.methods.configurator).toBeDefined();

            const result = component.methods.configurator();
            expect(result).toBe('page-badge-configure');
        });

        it('should have update method', () => {
            const component = getComponentOptions();
            expect(component.methods.update).toBeDefined();
            expect(typeof component.methods.update).toBe('function');
        });
    });

    describe('Component Computed Properties', () => {
        it('should have tooltip computed property', () => {
            const component = getComponentOptions();
            expect(component.computed.tooltip).toBeDefined();
            expect(typeof component.computed.tooltip).toBe('function');
        });

        it('should return undefined when no tooltip is set', () => {
            const component = getComponentOptions();
            const mockContext = {
                cell: {
                    state: {}
                },
                $services: mockServices
            };

            const result = component.computed.tooltip.call(mockContext);
            expect(result).toBeUndefined();
        });

        it('should return tooltip when set', () => {
            const component = getComponentOptions();
            const mockContext = {
                cell: {
                    state: {
                        tooltip: 'Test tooltip'
                    }
                },
                $services: mockServices
            };

            const result = component.computed.tooltip.call(mockContext);
            expect(result).toBe('Test tooltip');
        });
    });

    describe('Component Rendering', () => {
        it('should register a template reference', () => {
            const component = getComponentOptions();
            expect(component.template).toBe('#page-badge');
        });

        it('should include static badge markup for view mode', () => {
            const template = templates['page-badge'];
            expect(template).toContain('class="is-badge"');
            expect(template).toContain("class=\"is-text\" v-if=\"cell.state.content && !edit\"");
        });

        it('should include inline editor markup for edit mode', () => {
            const template = templates['page-badge'];
            expect(template).toContain('class="is-text is-inline-editor"');
            expect(template).toContain(':contenteditable="true"');
        });
    });
});
