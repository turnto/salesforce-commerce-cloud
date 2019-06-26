'use strict';

$('form.login').submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    $('form.login').trigger('login:submit', e);
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: form.serialize(),
        success: function (data) {
            form.spinner().stop();
            if (data.error) {
                $('.login-page .error').text(data.error);
            } else {
                TurnTo.localAuthenticationComplete();
                location.reload();
            }
        },
        error: function (data) {
            $('.login-page .error').text(data.error);
        }
    });
    return false;
});