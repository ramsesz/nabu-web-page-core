// Test setup file for Vue 2 components
const fs = require('fs');
const path = require('path');

// Mock global Vue if not already available
if (typeof global.Vue === 'undefined') {
    global.Vue = require('vue');
}

// Helper function to load .tpl template files
global.loadTemplate = function (templatePath) {
    const content = fs.readFileSync(templatePath, 'utf-8');

    // Parse template content and extract templates
    const templateRegex = /<template id="([^"]+)">([\s\S]*?)<\/template>/g;
    const templates = {};

    let match;
    while ((match = templateRegex.exec(content)) !== null) {
        const [, id, template] = match;
        templates[id] = template.trim();
    }

    return templates;
};

// Helper to register templates in the DOM
global.registerTemplates = function (templates) {
    Object.keys(templates).forEach(id => {
        const template = document.createElement('script');
        template.id = id;
        template.type = 'text/x-template';
        template.innerHTML = templates[id];
        document.body.appendChild(template);
    });
};

// Mock common services that might be used in components
global.mockServices = {
    q: {
        defer: function () {
            return {
                promise: Promise.resolve(),
                resolve: function (value) { return Promise.resolve(value); },
                reject: function (reason) { return Promise.reject(reason); }
            };
        }
    },
    page: {
        interpret: function (value) { return value; },
        translate: function (value) { return value; },
        getPageInstance: function () { return {}; }
    },
    typography: {
        replaceVariables: function (pageInstance, state, content) { return content; }
    }
};

// Mock window.application if needed
global.$window = {
    application: {
        configuration: {
            root: '/test-root/'
        }
    }
};

// Setup Vue to use templates
Vue.config.productionTip = false;
Vue.config.devtools = false;
