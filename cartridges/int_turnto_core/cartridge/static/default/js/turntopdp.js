function roundRatingToNearestTenth(rating){
	rating = Math.round((rating + 0.25) * 100.0) / 100.0;
	rating = rating.toString();
	var decimal = parseInt(rating.substring(2, 3));
	rating = rating.substring(0, 1) + "-" + (decimal >= 5 ? '5' : '0');
	return rating;
}

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

function clickQaFromTeaser() {
	/* if Q&A resides in a UI tab, logic for clicking and revealing the tab goes here.
	   if not, use the code below
	 */
	$("html, body").animate({ scrollTop: $('#TurnToContent').offset().top}, 1500);
}

function clickReviewFromTeaser() {
	/* if Reviews reside in a UI tab, logic for clicking and revealing the tab goes here.
	   if not, use the code below
	 */
	$("html, body").animate({ scrollTop: $('#TurnToReviewsContent').offset().top}, 1500);
}

/* Combo teaser is used if both the Reviews and Q&A are enabled */
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

/* QA-only teaser is used if Q&A is enabled, but Reviews are not */
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

/* Combo teaser is used if both the Reviews and Q&A are enabled */
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

/* Reviews-only teaser is used if Reviews are enabled, but Q&A is not */
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