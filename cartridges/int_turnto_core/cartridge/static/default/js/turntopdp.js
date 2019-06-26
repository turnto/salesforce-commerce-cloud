/**
 * @function
 * @name roundRatingToNearestTenth
 * @description logic for rounding rating number to the nearest tenth
 * @param rating
 * @returns rating
 */
function roundRatingToNearestTenth(rating){
    rating = Math.round((rating + 0.25) * 100.0) / 100.0;
    rating = rating.toString();
    var decimal = parseInt(rating.substring(2, 3));
    rating = rating.substring(0, 1) + "-" + (decimal >= 5 ? '5' : '0');
    return rating;
}

/**
 * @function
 * @name deepLinkScroll
 * @description logic for handling deep link scrolling
 */
function deepLinkScroll() {
    var elemIds = {'reviews': '#TurnToReviewsContent', 'qa': '#TurnToContent', 'comments': '#TurnToChatterContent'};
    if(window.location.href && window.location.href.indexOf('ttdeeplink') != -1) {
        var rslt = window.location.href.match(/ttdeeplink=(reviews|qa|comments)/);
        if (rslt.length > 1) {
            var elemId = elemIds[rslt[1]];
            // scroll down to the element 
            if ($(elemId).length) {
                $("html, body").animate({ scrollTop: $(elemId).offset().top}, 500);
            }
        }
    }
}

/**
 * @function
 * @name clickQaFromTeaser
 * @description logic for handling click logic for click QA
 */
function clickQaFromTeaser() {
    /* if Q&A resides in a UI tab, logic for clicking and revealing the tab goes here.
       if not, use the code below
     */
    $("html, body").animate({ scrollTop: $('#TurnToContent').offset().top}, 1500);
}

/**
 * @function
 * @name clickReviewFromTeaser
 * @description logic for handling click logic for click review
 */
function clickReviewFromTeaser() {
    /* if Reviews reside in a UI tab, logic for clicking and revealing the tab goes here.
       if not, use the code below
     */
    $("html, body").animate({ scrollTop: $('#TurnToReviewsContent').offset().top}, 1500);
}

/**
 * @function
 * @name qaComboTeaser
 * @description Combo teaser is used if both the Reviews and Q&A are enabled
 */
function qaComboTeaser() {
    if(typeof(TurnToItemData) == 'undefined' || typeof(TurnToItemData.counts) == 'undefined') {
        return '';
    } else {
        var answerCount = TurnToItemData.counts.a;
        var questionCount = TurnToItemData.counts.q;
        var teaserContainer = TurnTojQuery(".TurnToItemTeaser");

        var teaserHtml = ' | ';

        if(questionCount == 0) {
            teaserHtml = teaserHtml + '<a id="askQuestion" href="javascript:void(0)">Ask a Question</a>';
        } else {
            teaserHtml = teaserHtml + '<a id="readQuestions" href="javascript:void(0)">' + questionCount + ' Question' + (questionCount == 1 ? '' : 's') + ', ' + answerCount + ' Answer' + (answerCount == 1 ? '' : 's') + '</a>';
        }
        
        // Fill container with Q&A content
        teaserContainer.html(teaserHtml);

        // Add the appropriate listeners to the links
        teaserContainer.find('#askQuestion').click(function(e) {
            e.preventDefault();
            clickQaFromTeaser();
        });

        teaserContainer.find('#readQuestions').click(function(e) {
            e.preventDefault();
            clickQaFromTeaser();
        });
    }
}

/**
 * @function
 * @name qaOnlyTeaser
 * @description QA-only teaser is used if Q&A is enabled, but Reviews are not
 */
function qaOnlyTeaser() {
    if(typeof(TurnToItemData) == 'undefined' || typeof(TurnToItemData.counts) == 'undefined') {
        return '';
    } else {
        var answerCount = TurnToItemData.counts.a;
        var questionCount = TurnToItemData.counts.q;
        var teaserContainer = TurnTojQuery(".TurnToItemTeaser");

        var teaserHtml = '';

        if(questionCount == 0) {
            teaserHtml +='<a id="askQuestion" href="javascript:void(0)">Be the first to ask a auestion</a>';
        } else {
            teaserHtml +='<a id="askQuestion" href="javascript:void(0)">Ask a Question</a>';
        }

        if(answerCount != 0 || questionCount != 0) {
            teaserHtml +=' | <a id="readQuestions" href="javascript:void(0)">' + 'See ' + questionCount + ' Question' + (questionCount == 1 ? '' : 's') + ', ' + answerCount + ' Answer' + (answerCount == 1 ? '' : 's') + '</a>';
        }

        // Fill container with Q&A content
        teaserContainer.html(teaserHtml);

        // Add the appropriate listeners to the links
        teaserContainer.find('#askQuestion').click(function(e) {
            e.preventDefault();
            clickQaFromTeaser();
        });

        teaserContainer.find('#readQuestions').click(function(e) {
            e.preventDefault();
            clickQaFromTeaser();
        });
    }
}

/**
 * @function
 * @name reviewsComboTeaser
 * @description Combo teaser is used if both the Reviews and Q&A are enabled
 */
function reviewsComboTeaser() {
    if(typeof(TurnToItemData) == 'undefined' || typeof(TurnToItemData.counts) == 'undefined') {
        return '';
    } else {
        var reviewCount = TurnToItemData.counts.r;
        var teaserContainer = TurnTojQuery(".TurnToReviewsTeaser");
        var teaserHtml = '';

        // round the average rating to the nearest tenth
        var rating = roundRatingToNearestTenth(TurnToItemData.counts.ar);

        if(reviewCount == 0) {
            teaserHtml = '<div class="TT2left TTratingBox TTrating-0-0"></div> <a id="writeReview" href="javascript:void(0)">Write a Review</a>';
        } else {
            teaserHtml = '<div class="TTratingBox TTrating-' + rating + '"></div><a id="readReviews" href="javascript:void(0)">' + reviewCount + ' Review' + (reviewCount == 1 ? '' : 's') + '</a>';
        }

        teaserContainer.html(teaserHtml);

        // Listener on 'read reviews' link
        teaserContainer.find('#readReviews').click(function(e) {
            e.preventDefault();
            clickReviewFromTeaser();
        });

        // Listener on 'write review' link
        teaserContainer.find('#writeReview').click(function(e) {
            e.preventDefault();
            clickReviewFromTeaser();
            TurnTo.writeReview();
        });
    }
}

/**
 * @function
 * @name reviewsOnlyTeaser
 * @description Used by TurnTo to see if user is logged in
 */
function reviewsOnlyTeaser() {
    if(typeof(TurnToItemData) == 'undefined' || typeof(TurnToItemData.counts) == 'undefined') {
        return '';
    } else {
        var reviewCount = TurnToItemData.counts.r;
        var teaserContainer = TurnTojQuery(".TurnToReviewsTeaser");
        var teaserHtml = '';

        // round the average rating to the nearest tenth
        var rating = roundRatingToNearestTenth(TurnToItemData.counts.ar);

        if(TurnToItemData.counts.ar > 0) {
            teaserHtml +='<div class="TT2left TTratingBox TTrating-' + rating + '"></div>';
        }

        if(reviewCount == 0) {
            teaserHtml += '<div><a class="TTwriteReview" href="javascript:void(0);">Be the first to write a review</a></div>';
        } else {
            teaserHtml += '<div class="TTratingLinks">' +
            ' <a class="TTreadReviews" href="javascript:void(0)">Read ' + reviewCount + ' Review' + (reviewCount == 1 ? '' : 's') + '</a>' +
            ' or <a class="TTwriteReview" href="javascript:void(0)">Write a Review</a>' +
            '</div>' +
            '<div class="TTclear"></div>';
        }
        teaserHtml += '</div>';
        teaserContainer.html(teaserHtml);

        // Listener on 'read reviews' link
        teaserContainer.find('a.TTreadReviews').click(function(e) {
            e.preventDefault();
            clickReviewFromTeaser();
        });

        // Listener on 'write review' link
        teaserContainer.find('a.TTwriteReview').click(function(e) {
            e.preventDefault();
            clickReviewFromTeaser();
            TurnTo.writeReview();
        });
    }
}

//Single Sign On (SSO) Functions
/**
 * @function
 * @name localGetLoginStatusFunction
 * @description Used by TurnTo to see if user is logged in
 * @param callbackFn
 * @returns callbackFn callback function with auth token
 */
function localGetLoginStatus(callbackFn) {

    $.ajax({
        url: getLoginStatus,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if(data.loggedIn) {
                var yourAuthToken = getAuthToken();
                return callbackFn({user_auth_token:yourAuthToken});
            } else {
                //if the user is not authenticated, the registration URL "localRegistrationUrl" is loaded into the iframe
                return callbackFn({user_auth_token:null});
            }
        }
    });
}

/**
 * @function
 * @name localAuthenticationComplete
 * @description Used by TurnTo to tell the system the user has been authenticated
 */
function localAuthenticationComplete() {
    //Call TurnTo API system, the variable "TurnTo" references the main script
    TurnTo.localAuthenticationComplete();
}

/**
 * @function
 * @name localGetUserInfoFunction
 * @description Used by TurnTo to retrieve user info (This function is called by TurnTo code to get details about the currently logged-in user on the Partner site.)    
 * @param callbackFn
 */
function localGetUserInfo(callbackFn) {
    
    $.ajax({
        url: getUserInfoURL,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            var obj = {};
            if (data.success) {
                obj.user_auth_token = getAuthToken();
                obj.first_name = data.first_name;
                obj.last_name = data.last_name;
                obj.email = data.email;
                obj.email_confirmed = data.email_confirmed; // true or false
                obj.nickname = data.first_name;
                obj.issued_at = data.issued_at;
                //authenticate user for TurnTo
                localAuthenticationComplete();
                return callbackFn(obj, data.signature);
            }
            return callbackFn(obj, '');
        }
    });
    return;
}

/**
 * @function
 * @name localLogoutFunction
 * @description Used by TurnTo to logout user when receiving email question
 * @param callbackFn
*/
function localLogout(callbackFn) {

    $.ajax({
        url: logoutURL,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            //return callback, A function that’s passed by the calling TurnTo code that should be executed by the Partner implementation after the logout is successfully accomplished. The callback function takes no arguments.
        },
        error: function (err) {
            //If an error has occurred while logging the user out, the callback function need not be called at all.
        }
    });

    return;
}

/**
 * @function
 * @name getAuthToken
 * @description Determines the login state of a user, and if logged in, return a "user auth token"
*/
function getAuthToken() {
    return getCookie('sid');
}

/**
 * @function
 * @name getCookie
 * @description Get cookie value by cookie name from browser
 * @param {string} cookieName - name of the cookie
 * @returns {string} cookie value of the found cookie name
 */
function getCookie(cookieName) {
    var name = cookieName + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookieItem = cookieArray[i];
        while (cookieItem.charAt(0) === ' ') {
            cookieItem = cookieItem.substring(1);
        }
        if (cookieItem.indexOf(name) === 0) {
            return cookieItem.substring(name.length, cookieItem.length);
        }
    }
    return '';
}
