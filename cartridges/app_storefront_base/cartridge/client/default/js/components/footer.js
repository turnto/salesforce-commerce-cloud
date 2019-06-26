'use strict';

module.exports = function () {
    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
};
