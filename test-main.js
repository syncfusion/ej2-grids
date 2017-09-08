var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',
    waitSeconds: 0,
    packages: [
        {
            name: '@syncfusion/ej2-base',
            location: 'node_modules/@syncfusion/ej2-base',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-data',
            location: 'node_modules/@syncfusion/ej2-data',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-buttons',
            location: 'node_modules/@syncfusion/ej2-buttons',
            main: 'index.js'
        },

        {
            name: '@syncfusion/ej2-inputs/src/button',
            location: 'node_modules/@syncfusion/ej2-inputs/src/button',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-inputs/src/checkbox',
            location: 'node_modules/@syncfusion/ej2-inputs/src/checkbox',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-inputs',
            location: 'node_modules/@syncfusion/ej2-inputs',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-inputs/src/input',
            location: 'node_modules/@syncfusion/ej2-inputs/src/input',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-inputs/src/numerictextbox',
            location: 'node_modules/@syncfusion/ej2-inputs/src/numerictextbox',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-inputs/src/maskedtextbox',
            location: 'node_modules/@syncfusion/ej2-inputs/src/maskedtextbox',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups',
            location: 'node_modules/@syncfusion/ej2-popups',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups/src/popup',
            location: 'node_modules/@syncfusion/ej2-popups/src/popup',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups/src/tooltip',
            location: 'node_modules/@syncfusion/ej2-popups/src/tooltip',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups/src/dialog',
            location: 'node_modules/@syncfusion/ej2-popups/src/dialog',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-lists/src/common',
            location: 'node_modules/@syncfusion/ej2-lists/src/common',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups/src/common',
            location: 'node_modules/@syncfusion/ej2-popups/src/common',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups/src/dialog',
            location: 'node_modules/@syncfusion/ej2-popups/src/dialog',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-popups/src/popup',
            location: 'node_modules/@syncfusion/ej2-popups/src/popup',
            main: 'index.js'
        },
        {
            name: '@syncfusion/ej2-dropdowns',
            location: 'node_modules/@syncfusion/ej2-dropdowns',
            main: 'src/drop-down-base/index.js'
        },
        {
            name: '@syncfusion/ej2-dropdowns',
            location: 'node_modules/@syncfusion/ej2-dropdowns',
            main: 'src/drop-down-list/index.js'
        },
        {
            name: '@syncfusion/ej2-navigations',
            location: 'node_modules/@syncfusion/ej2-navigations',
            main: 'src/toolbar/index.js'
        }
        // Include dependent packages
    ],

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
