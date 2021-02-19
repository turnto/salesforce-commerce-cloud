'use strict';

/* eslint-disable no-proto */
/**
 * Create a mock module.superModule
 */
function create(mock) {
    module.__proto__.superModule = mock;
}

/**
 * Delete the mock module.superModule
 */
function remove() {
    delete module.__proto__.superModule;
}

module.exports = {
    create: create,
    remove: remove
};
