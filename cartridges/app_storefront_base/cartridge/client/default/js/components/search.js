'use strict';

var debounce = require('lodash/debounce');
var endpoint = $('.suggestions-wrapper').data('url');
var minChars = 3;


/**
 * Retrieves Suggestions element relative to scope
 *
 * @param {Object} scope - Search input field DOM element
 * @return {JQuery} - .suggestions-wrapper element
 */
function getSuggestionsWrapper(scope) {
    return $(scope).siblings('.suggestions-wrapper');
}

/**
 * Determines whether DOM element is inside the .search-mobile class
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 * @return {boolean} - Whether DOM element is inside  div.search-mobile
 */
function isMobileSearch(scope) {
    return !!$(scope).closest('.search-mobile').length;
}

/**
 * Remove modal classes needed for mobile suggestions
 *
 */
function clearModals() {
    $('body').removeClass('modal-open');
    $('.suggestions').removeClass('modal');
}

/**
 * Apply modal classes needed for mobile suggestions
 *
 * @param {Object} scope - Search input field DOM element
 */
function applyModals(scope) {
    if (isMobileSearch(scope)) {
        $('body').addClass('modal-open');
        getSuggestionsWrapper(scope).find('.suggestions').addClass('modal');
    }
}

/**
 * Tear down Suggestions panel
 */
function tearDownSuggestions() {
    $('input.search-field').val('');
    clearModals();
    $('.search-mobile .suggestions').unbind('scroll');
    $('.suggestions-wrapper').empty();
}

/**
 * Toggle search field icon from search to close and vice-versa
 *
 * @param {string} action - Action to toggle to
 */
function toggleSuggestionsIcon(action) {
    var mobileSearchIcon = '.search-mobile span.';
    var iconSearch = 'fa-search';
    var iconSearchClose = 'fa-close';

    if (action === 'close') {
        $(mobileSearchIcon + iconSearch).removeClass(iconSearch).addClass(iconSearchClose);
    } else {
        $(mobileSearchIcon + iconSearchClose).removeClass(iconSearchClose).addClass(iconSearch);
    }
}

/**
 * Determines whether the "More Content Below" icon should be displayed
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 */
function handleMoreContentBelowIcon(scope) {
    if (($(scope).scrollTop() + $(scope).innerHeight()) >= $(scope)[0].scrollHeight) {
        $('.more-below').fadeOut();
    } else {
        $('.more-below').fadeIn();
    }
}

/**
 * Positions Suggestions panel on page
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 */
function positionSuggestions(scope) {
    var outerHeight;
    var $scope;
    var $suggestions;
    var top;

    if (isMobileSearch(scope)) {
        $scope = $(scope);
        top = $scope.offset().top;
        outerHeight = $scope.outerHeight();
        $suggestions = getSuggestionsWrapper(scope).find('.suggestions');
        $suggestions.css('top', top + outerHeight);

        handleMoreContentBelowIcon(scope);

        // Unfortunately, we have to bind this dynamically, as the live scroll event was not
        // properly detecting dynamic suggestions element's scroll event
        $suggestions.scroll(function () {
            handleMoreContentBelowIcon(this);
        });
    }
}

/**
 * Process Ajax response for SearchServices-GetSuggestions
 *
 * @param {Object|string} response - Empty object literal if null response or string with rendered
 *                                   suggestions template contents
 */
function processResponse(response) {
    var $suggestionsWrapper = getSuggestionsWrapper(this).empty();

    $.spinner().stop();

    if (!(typeof (response) === 'object')) {
        $suggestionsWrapper.append(response).show();
        positionSuggestions(this);

        if (isMobileSearch(this)) {
            toggleSuggestionsIcon('close');
            applyModals(this);
        }
    } else {
        $suggestionsWrapper.hide();
    }
}

/**
 * Retrieve suggestions
 *
 * @param {Object} scope - Search field DOM element
 */
function getSuggestions(scope) {
    if ($(scope).val().length >= minChars) {
        $.spinner().start();
        $.ajax({
            context: scope,
            url: endpoint + encodeURIComponent($(scope).val()),
            method: 'GET',
            success: processResponse,
            error: function () { $.spinner().stop(); }
        });
    } else {
        toggleSuggestionsIcon('search');
        clearModals();
        getSuggestionsWrapper(scope).empty();
    }
}

module.exports = function () {
    $('input.search-field').each(function () {
        /**
         * Use debounce to avoid making an Ajax call on every single key press by waiting a few
         * hundred milliseconds before making the request. Without debounce, the user sees the
         * browser blink with every key press.
         */
        var debounceSuggestions = debounce(getSuggestions, 300);

        $(this).on('keyup click', function (e) {
            debounceSuggestions(this, e);
        });
    });

    $('body').on('click', function (e) {
        if (!$('.suggestions').has(e.target).length && !$(e.target).hasClass('search-field')) {
            $('.suggestions').hide();
        }
    });

    $('body').on('click touchend', '.search-mobile span.fa-close', function () {
        $('.suggestions').hide();
        toggleSuggestionsIcon('search');
        tearDownSuggestions();
    });
};
