'use strict';
module.exports = function () {
    var sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    sizes.forEach(function (size) {
        var selector = '.collapsible-' + size + ' .title, .collapsible-' + size + '>.card-header';
        $('body').on('click', selector, function (e) {
            e.preventDefault();
            $(this).parents('.collapsible-' + size).toggleClass('active');
        });
    });
};
