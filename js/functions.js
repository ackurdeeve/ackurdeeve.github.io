function dmp(text) {
    console.log(text);
}

function ddmp(text) {
    console.log(text);
    throw true;
}

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    var pad = function (n, z) {
        if (!z) {
            z = 2;
        }

        return ('00' + n).slice(-z);
    };
    return pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0);
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkMail(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(email);
}

function checkEmpty($_this) {
    if ($_this.is('[type=checkbox]')) {
        if (!$_this.prop('checked')) {
            $_this.addClass('formInputInvalid');
            return false;
        }
    } else if ($_this.is("[type=radio]")) {
        if (!$("[name='" + $_this.prop('name') + "']:checked").val()) {
            $_this.addClass('formInputInvalid');
            return false;
        }
    } else {
        if ($_this.val() == '') {
            $_this.addClass('formInputInvalid');
            return false;
        }
    }
    $_this.removeClass('formInputInvalid');
    return true;
}

function checkNumeric($_this) {
    if (!isNumeric($_this.val())) {
        $_this.addClass('formInputInvalid');
        return false;
    }
    $_this.removeClass('formInputInvalid');
    return true;
}


function ajaxOverlay(status) {
    if (status == 'show') {
        $(".ajaxOverlay").show();
    } else
        $(".ajaxOverlay").hide();
}

function showPopup($_this, $_class) {
    $("." + $_class).fadeIn(150);
    $("." + $_class).parent().find("[name='popup_id']").val($_this.attr('id'));
}

function hidePopup($_this) {
    $_this.parents().eq(2).fadeOut(150);
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function search() {
    var q = $('[name="search"]').val();
    if (q.length < 3) return false;

    $.ajax({
        url: _baseUrl + '/index/search',
        method: 'get',
        data: {
            q: q,
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                $('.search-result').show();
                $('.search-result').html(response.data);
            }
        }
    })
}

function getUrls(text) {
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while ((matchArray = regexToken.exec(source)) !== null) {
        var token = matchArray[0];
        urlArray.push(token);
    }

    return urlArray;
}

function applyFunctions(string, $trigger, response, callback_args) {
    if (typeof string === 'undefined' || string == '') {
        return true;
    }

    var returned = true;
    var functions = string.split(';');
    for (var i = 0; i < functions.length; i++) {
        var function_split = functions[i].trim().split('(');
        var callback_name = function_split[0].split('.');

        var args = [];
        if (typeof callback_args !== 'undefined' && function_split[0] in callback_args) {
            args = callback_args[function_split[0]];
            for (var j = 0; j < args.length; j++) {
                if (args[j] == 'undefined') {
                    args[j] = undefined;
                }
            }
        } else {
            if (function_split.length > 0 && typeof function_split[1] !== 'undefined') {
                args = function_split[1].replace(/\)+$/, '').split(',');
                if (args.length == 1 && !args[0]) {
                    args = [];
                } else {
                    for (var j = 0; j < args.length; j++) {
                        args[j] = args[j].trim().replace(/\'$/, '').replace(/^\'/, '');
                        if (args[j] == 'undefined') {
                            args[j] = undefined;
                        }
                    }
                }
            }
        }

        args.push($trigger);
        args.push(response);

        if (callback_name.length > 1) {
            returned = window[callback_name[0]][callback_name[1]].apply(this, args);
        } else if (callback_name[0]) {
            returned = window[callback_name[0]].apply(window, args);
        }

        //break if one function returned false
        if (returned === false) {
            break;
        }
    }

    //returns false if not all return true
    return returned;
}


function confirmPopup(options) {
    var default_options = {
        ok: {
            text: 'Ok',
            action: 'closeCustomModal(\'.confirm-popup\')',
            href: false,
            on_click: false,
            data: null,
            class: '',
        },
        cancel: {
            text: 'Cancel',
            action: 'closeCustomModal(\'.confirm-popup\')',
            href: false,
            data: null,
            class: '',
        },

        close: true,
        trigger: null,

        title: 'Please confirm your action',
        message: 'Are you sure about this?',
    };

    if (typeof options === 'undefined') options = {};

    //set defaults
    for (var key in default_options) {
        if (options[key] === null) continue;

        if (typeof default_options[key] === 'object') {
            for (var key2 in default_options[key]) {
                if (typeof options[key] === 'undefined') options[key] = {};

                if (!(key2 in options[key])) {
                    options[key][key2] = default_options[key][key2];
                }
            }
        } else {
            if (!(key in options)) {
                options[key] = default_options[key];
            }
        }
    }

    var $popup = $('.confirm-popup');
    $popup.find('[data-id="title"]').html(options.title);
    $popup.find('[data-id="message"]').html(options.message);

    var $buttons = {
        ok: $popup.find('[data-id="ok-button"]'),
        cancel: $popup.find('[data-id="cancel-button"]')
    };

    for (var key in $buttons) {
        if (options[key] === null) continue;

        $buttons[key].html(options[key].text);
        $buttons[key].addClass(options[key].class);

        //set trigger
        $buttons[key].data('trigger', options.trigger);

        if (options[key].href) {
            $buttons[key].prop('href', options[key].href);
        } else if (options[key].on_click) {
            $buttons[key].attr('onclick', options[key].on_click);
        } else if (options[key].action) {
            $buttons[key].prop('href', 'javascript:' + options[key].action + ';');
        }

        if (typeof options[key].data !== 'undefined') {
            for (var data_key in options[key].data) {
                $buttons[key].data(data_key, options[key].data[data_key]);
            }
        }
    }

    if (options['ok'] === null) $buttons['ok'].hide();
    if (options['cancel'] === null) $buttons['cancel'].hide();
    if (options['close'] === null) $popup.find('.custom-modal-x').hide();

    $buttons['ok'].focus();
    $popup.show();
}

//type = error, warning, info, success
function showAlert(message, type, duration) {
    var $alert = $('.show-alert');

    if (typeof message === 'object') {
        message = message.join('<br/>');
    }

    if (!type) {
        type = 'success';
    }

    if (!duration) {
        duration = 7000;
    }

    $alert.find('.show-alert-message').html(message);
    $alert.attr('class', 'show-alert').show().addClass(type);

    var i_class = '';
    switch (type) {
        case 'info':
            i_class = 'ion-information-circled';
            break;

        case 'error':
            i_class = 'ion-close-circled';
            break;

        case 'warning':
            i_class = 'ion-alert-circled';
            break;

        case 'success':
            i_class = 'ion-checkmark';
            break;

        default:
            i_class = 'ion-asterisk';
            break;
    }

    $alert.find('i').addClass(i_class);

    clearTimeout(show_alert_timeout);
    show_alert_timeout = setTimeout(function () {
        $alert.hide();
    }, duration);
}


function initCustomModal() {
    $('[data-toggle="custom-modal"]').click(function () {
        showCustomModal('.' + $(this).data('target'));
    });

    $(document).on('click', '[data-dismiss="custom-modal"]', function () {
        closeCustomModal($(this));
    });

    $(document).mouseup(function (e) {
        var container = $('.custom-modal .custom-modal-content:visible');
        if (!container.length) {
            container = $('.custom-modal .custom-modal-wrap:visible');
        }

        if (!container.length) return;

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            closeCustomModal($(e.target));
        }
    });
}

function showCustomModal(selector) {
    if (typeof selector === 'undefined') {
        selector = '.custom-modal';
    }

    var $selector = $(selector);
    $selector.show();

    if ($selector.hasClass('schedule-modal') || $selector.hasClass('pinterest-modal')) {
        $('.compose-modal').addClass('schedule-open');
    }
}

function closeCustomModal(selector) {
    if (typeof selector === 'undefined') {
        selector = '.custom-modal';
    }

    if (typeof selector === 'object') {
        selector.closest('.custom-modal').hide();

        if (selector.closest('.custom-modal').hasClass('schedule-modal') || selector.closest('.custom-modal').hasClass('pinterest-modal')) {
            $('.compose-modal').removeClass('schedule-open');
        }
    } else {
        $(selector).hide();

        if ($(selector).hasClass('schedule-modal') || $(selector).hasClass('pinterest-modal')) {
            $('.compose-modal').removeClass('schedule-open');
        }
    }
}

function isInViewport($element) {
    var $window = $(window);
    const elementTop = $element.offset().top;
    const elementBottom = elementTop + $element.outerHeight();
    const viewportTop = $window.scrollTop();
    const viewportBottom = viewportTop + $window.height();

    return elementBottom + 400 > viewportTop && elementTop - 400 < viewportBottom;
}

function lazyload() {
    $('[data-lazyload]').each(function (i, element) {
        const $this = $(element);
        let $img;

        let stop = false;

        if (!isInViewport($this.parent())) {
            stop = true;
        }

        if ($this.parent().is('[data-responsive-bg-lazy]') && isInViewport($this.parent())) {
            stop = false;
        }

        if ($this.data('lazyloaded')) {
            stop = true;
        }


        if (stop) {
            return;
        }

        if ($this.is('img')) {
            $img = $this;
        } else {
            $img = $this.find('img');
        }

        $img.on('load', function () {
            $this.css('opacity', 1);
            $img.css('opacity', 1);
            $img.trigger('lazyloaded');
            $this.data('lazyloaded', true);
        });

        $img.attr('src', $img.data('src'));

        if (!$this.is('img')) {
            $this.find('source').each(function (j, elementSource) {
                const $source = $(elementSource);
                $source.attr('srcset', $source.data('srcset'));
            });
        }
    });
}

class ResponsiveBackgroundImage {
    init(element) {
        this.element = element;
        this.img = element.querySelector('img');
        this.src = '';

        if (this.img) {
            this.img.addEventListener('load', function () {
                this.update();
            });

            if (this.img.complete) {
                this.update();
            }
        }
    }

    update() {
        const src =
            typeof this.img.currentSrc !== 'undefined'
                ? this.img.currentSrc
                : this.img.src;
        if (this.src !== src) {
            this.src = src;
            this.element.style.backgroundImage = `url("${this.src}")`;
            this.element.dataset.responsiveBgFadeLoaded = true;
        }
    }
}

function filterHeroesByClass(options) {
    var $span = $('[data-build-results]');
    var $heroes = $('[data-hero-search]');
    var class_name = options.class_name;
    var mode = $('[data-build-class-mode]').data('build-class-mode');
    var remove = options.remove;

    //force reset
    if (options.force_reset) {
        $('[data-build-class]').removeClass('filtered-out active');
        $span.html('').data('build-results', 0);
        $heroes.removeClass('filtered-out');

        return;
    }

    //if there are no more active classes, reset them
    if (remove && !$('[data-build-class].active').length) {
        $('[data-build-class]').removeClass('filtered-out');

        //reset results span and heroes
        $span.html('').data('build-results', 0);
        $heroes.removeClass('filtered-out');

        return;
    }

    //disable all heroes for first time
    if (mode == 'include' && !remove && $('[data-build-class].active').length == 1) {
        $heroes.addClass('filtered-out');
    }

    //get current active classes
    var active_classes = [];
    $('[data-build-class].active').each(function () {
        active_classes.push($(this).data('build-class'));
    });

    //get heroes results
    var results = parseInt($span.data('build-results'));
    if (mode == 'exclude') {
        $heroes.addClass('filtered-out');

        results = 0;
        $heroes.each(function () {
            var $this = $(this);
            var hero_name = $this.data('hero-search');
            var activate = true;

            for (var i = 0; i < active_classes.length; i++) {
                if (hero_classes[hero_name].indexOf(active_classes[i]) == -1) {
                    activate = false;
                }
            }

            if (activate) {
                results++;
                $this.removeClass('filtered-out');
            }
        });
    } else {
        $heroes.each(function () {
            var $this = $(this);
            var hero_name = $this.data('hero-search');

            if (hero_classes[hero_name].indexOf(class_name) == -1) {
                return;
            }

            if (remove) {
                //remove only if there are no common active classes
                for (var i = 0; i < active_classes.length; i++) {
                    //exclude current class
                    if (active_classes[i] == class_name) {
                        continue;
                    }

                    if (hero_classes[hero_name].indexOf(active_classes[i]) !== -1) {
                        return;
                    }
                }

                results--;
                $this.addClass('filtered-out');
            } else {
                results++;
                $this.removeClass('filtered-out');
            }
        });
    }

    //set results span
    var text = '个英雄';
    if (results == 1) {
        text = '个英雄';
    }
    $span.html('找到' + ' ' + results + ' ' + text).data('build-results', results);
}

function getClassBuffs($board) {
    if (!$board) {
        $board = $('.board');
    }

    var current_heroes = [];
    var current_classes = {};
    var current_classes_text = {};
    var current_classes_text_amount = {};
    var inactive_classes = [];

    $board.find('[data-board-div]:not(:empty)').each(function () {
        var $this = $(this);
        var hero = $this.find('.add-build__hero-inner').data('build-hero-inner');

        //check if hero is duplicate
        if (current_heroes.indexOf(hero) > -1) {
            return;
        }

        //save in current heroes for duplicate check
        current_heroes.push(hero);

        //get classes
        for (var i = 0; i < hero_classes[hero].length; i++) {
            if (current_classes[hero_classes[hero][i]]) {
                current_classes[hero_classes[hero][i]]++;
            } else {
                current_classes[hero_classes[hero][i]] = 1;
            }
        }
    });

    for (var class_name in current_classes) {
        for (var condition in classes[class_name].conditions) {

            //check conditions
            if (current_classes[class_name] < parseInt(condition)) {
                continue
            }

            //demon fel power
            if (class_name == 'Demon' && current_classes[class_name] > 1 && (!current_classes['DemonHunter'] || current_classes['DemonHunter'] < 2)) {
                continue;
            }

            //skip single buffs like Dwarf and Ogre
            if (['Dwarf', 'Ogre'].indexOf(class_name) > -1) {
                continue;
            }

            //init with empty text
            if (!current_classes_text[class_name]) {
                current_classes_text[class_name] = '';
                current_classes_text_amount[class_name] = 0;
            }

            if (class_name == 'Demon') {
                current_classes_text[class_name] += '恶魔的' + classes[class_name].conditions[condition] + '<br/>';
            } else {
                current_classes_text[class_name] += classes[class_name].conditions[condition] + '<br/>';
            }

            current_classes_text_amount[class_name]++;
        }
    }

    //get active buffs html
    var html = '';
    Object.keys(current_classes_text).sort().forEach(function (class_name) {
        html += '<div class="board__buff">' +
            '<div><i class="icon-c-' + class_name.toLowerCase() + '" title="' + class_name + '"></i>';

        if (class_name != 'Demon') {
            html += '<div>x' + current_classes_text_amount[class_name] + '</div>';
        }

        html += '</div>' +
            '<div>' + current_classes_text[class_name] + '</div>' +
            '</div>';
    });

    //get inactive buffs
    for (var class_name in current_classes) {
        if (!current_classes_text[class_name]) {
            inactive_classes.push(class_name);
        }
    }

    $board.closest('.board-wrapper').find('[data-build-buffs]').html(html);

    var inactive_html = ''
    if (inactive_classes.length) {
        inactive_html += '<div class="board__buff board__buff--inactive">';

        inactive_classes.forEach(function (class_name) {
            inactive_html += '<i class="icon-c-' + class_name.toLowerCase() + '" title="' + class_name + '"></i>';
        });

        inactive_html += '</div>';
    }

    $board.closest('.board-wrapper').find('[data-build-buffs-inactive]').html(inactive_html);

}

function voteBuildCheck($this) {
    if (!logged) {
        $this.parent().find('.build__actions-not-logged').show();
    }

    if ($this.hasClass('active')) {
        return false;
    }

    return logged;
}

function voteBuild(vote, $this) {
    if ($this.hasClass('active')) {
        return;
    }

    var $parent = $this.closest('.build__actions');

    var $votes_up = $parent.find('[data-build-votes-up]');
    var $votes_down = $parent.find('[data-build-votes-down]');
    var votes_up = parseInt($votes_up.html());
    var votes_down = parseInt($votes_down.html());
    var votes = {
        up: 'down',
        down: 'up',
    };
    var $counterpart = $parent.find('[data-vote="' + votes[vote] + '"]');

    if ($counterpart.hasClass('active')) {
        if (vote == 'up') {
            $votes_up.html(votes_up + 1);
            $votes_down.html(votes_down - 1);
        } else {
            $votes_up.html(votes_up - 1);
            $votes_down.html(votes_down + 1);
        }
    } else {
        if (vote == 'up') {
            $votes_up.html(votes_up + 1);
        } else {
            $votes_down.html(votes_down + 1);
        }
    }

    $this.addClass('active');
    $this.parent().find('[data-vote="' + votes[vote] + '"]').removeClass('active');
}

function saveBuild($this) {
    $this.addClass('active');
    $this.find('i').attr('class', 'icon-save-yellow inline-block');
}

function buildSaved(saved, id) {
    if (saved === 1) {
        html2canvas($('.board')[0]).then(function (canvas) {
            $.ajax({
                url: '/builds/post-screenshot/' + id,
                method: 'POST',
                data: {
                    image_data: canvas.toDataURL('image/jpeg'),
                },
                dataType: 'JSON',
                complete: function () {
                    window.location = '/make-build';
                }
            });
        });
    }
}

function deleteBuild($this) {
    $this.closest('.build').slideUp(200);
}

function heroSearch() {
    var $document = $(document);
    var hero_search = '';
    var hero_search_timeout;
    $document.on('keyup', 'body', function (e) {
        //tab
        if (e.which == 9) {
            e.preventDefault();
            return false;
        }

        if (!($(e.target).is('body'))) {
            return true;
        }

        //enter, shift, control, alt
        if ([13, 16, 17, 18].indexOf(e.which) > -1) {
            return true;
        }


        //save var for performance reasons
        var $hero = $('[data-hero-search]');
        var $heroSearchText = $('[data-hero-search-text]');

        //if escape, reset everyting
        if (e.which === 27) {
            $hero.removeClass('search-active').removeClass('search-inactive');
            hero_search = '';
            $heroSearchText.stop().css('opacity', 1).html('').hide();
            clearTimeout(hero_search_timeout);

            return true;
        }

        //backspace
        if (e.which == 8) {
            //if pressed backspace and the previous text was empty
            if (hero_search == '') {
                return true;
            }

            hero_search = hero_search.substring(0, hero_search.length - 1);
        }
        //add to search string
        else {
            hero_search = hero_search + String.fromCharCode(e.which);
        }
        hero_search = hero_search.toLowerCase();

        //if string is empty, reset everyting
        if (hero_search == '') {
            $hero.removeClass('search-active').removeClass('search-inactive');
            hero_search = '';
            $heroSearchText.stop().css('opacity', 1).html('').hide();
            clearTimeout(hero_search_timeout);

            return true;
        }

        //show text
        $heroSearchText.stop().css('opacity', 1).html(hero_search).show();

        //search
        var searchResults = [];
        //check if hero name starts with string
        $hero.each(function () {
            var $this = $(this);
            var hero_name = $this.data('hero-search').toLowerCase();

            if (hero_name.substring(0, hero_search.length) !== hero_search.toLowerCase()) {
                return;
            }

            searchResults.push(hero_name);
        });

        //check if hero name contains string
        if (!searchResults.length && hero_search.length > 1) {
            $hero.each(function () {
                var $this = $(this);
                var hero_name = $this.data('hero-search').toLowerCase();

                if (hero_name.indexOf(hero_search.toLowerCase()) === -1) {
                    return;
                }

                searchResults.push(hero_name);
            });
        }

        if (searchResults.length) {
            //set active/inactive
            $hero.each(function () {
                var $this = $(this);

                if (searchResults.indexOf($this.data('hero-search').toLowerCase()) > -1) {
                    $this.removeClass('search-inactive').addClass('search-active');
                } else {
                    $this.removeClass('search-active').addClass('search-inactive');
                }
            });
        } else {
            $hero.removeClass('search-active').addClass('search-inactive');
        }

        //clear search text timeout
        clearTimeout(hero_search_timeout);

        //start to fade text out
        $heroSearchText.delay(1000).fadeOut(2000);

        //set timeout
        hero_search_timeout = setTimeout(function () {
            hero_search = '';
        }, 2000);
    });

    $document.on('click', 'body', function (e) {
        $('[data-hero-search]').removeClass('search-active').removeClass('search-inactive');
        hero_search = '';
        $('[hero-search-text]').stop().css('opacity', 1).html('').hide();
    });
}

function registerChangeStep(step) {
    var margin = (step - 1) * 300;
    $('.register-form').prop('style', 'margin-left: -' + margin + 'px;');
}

function postComment(html) {
    $('[data-build-comments]').prepend(html);
}

function changeBuildPrivacy(is_private, $this) {
    if (is_private) {
        $this.addClass('hover-red').html('<i class="ion-ios-locked color-red"></i>');
    } else {
        $this.removeClass('hover-red').html('<i class="ion-ios-unlocked-outline"></i>');
    }
}

$(function () {
    $ranked_search = $('[data-ranked-search]');
    $ranked_search_p = $('[data-ranked-search] p');
    $ranked_timer = $('[data-ranked-timer]');
    $ranked_status = $('[data-ranked-status]');
});

function rankedStartSearch() {
    ranked_search_time = 0;
    rankedSearchInterval();
    ranked_interval = setInterval(rankedSearchInterval, 500);

    $ranked_search.addClass('btn-metal--red')
        .data('href', '/dac/stop-search')
        .data('callback', 'rankedStopSearch();')
        .data('keep-html', '1');

    $ranked_search_p.html('Stop Search');
    $ranked_status.html('').removeClass('color-red red-neon color-yellow yellow-neon').addClass('color-blue blue-neon');
}

function rankedSearchInterval() {
    $ranked_timer.html(msToTime(ranked_search_time));

    $.ajax({
        method: 'GET',
        url: '/dac/heartbeat-search',
        dataType: 'JSON',
        success: function (response) {
            if (response.success) {
                if (response.data.status.match(/invited/)) {
                    $ranked_search_p.html('Cancel');
                    $ranked_status.html('LOBBY FOUND! YOU HAVE BEEN INVITED!');

                    //play notification sound
                    if (!ranked_lobby_alert_played) {
                        var audio = new Audio('/audio/lobby-found-alert.mp3');
                        audio.play();
                        ranked_lobby_alert_played = true;
                    }
                } else if (response.data.status == 'joined') {
                    $ranked_status.html('YOU HAVE JOINED A LOBBY!');
                } else if (response.data.status == 'left') {
                    rankedStopSearch();
                } else if (response.data.status == 'start_game') {
                    $ranked_status.html('LOBBY IS FULL. PLEASE START THE GAME!').removeClass('color-blue blue-neon color-red red-neon').addClass('color-yellow yellow-neon');

                    //play notification sound
                    if (!ranked_start_alert_played) {
                        var audio = new Audio('/audio/start-alert.mp3');
                        audio.play();
                        ranked_start_alert_played = true;
                    }
                } else if (response.data.status == 'not_joined') {
                    rankedStopSearch();
                    $ranked_status.html('YOU DID NOT ACCEPT THE LOBBY INVITE!').removeClass('color-blue blue-neon color-yellow yellow-neon').addClass('color-red red-neon');
                } else if (response.data.status == 'none') {
                    rankedStopSearch();
                }

                $('[data-ranked-similar]').html(response.data.similar);
                $('[data-ranked-similar-searching]').html(response.data.similar_searching);
            }
        }
    });

    ranked_search_time += 500;
}

function rankedStopSearch() {
    $ranked_timer.html('');
    clearInterval(ranked_interval);

    $ranked_search.removeClass('btn-metal--red')
        .data('href', '/dac/start-search')
        .data('callback', 'rankedStartSearch();')
        .data('keep-html', '');

    $ranked_search_p.html('Start Search');
    $ranked_status.html('');

    ranked_lobby_alert_played = false;
    ranked_start_alert_played = false;
}

function botsStatus() {
    $.ajax({
        method: 'GET',
        url: '/get-bots-status-heartbeat',
        dataType: 'JSON',
        success: function (response) {
            $('[data-bots-status]').html(response.data);
        }
    });
}

function usersStatus() {
    $.ajax({
        method: 'GET',
        url: '/get-users-status-heartbeat',
        dataType: 'JSON',
        success: function (response) {
            $('[data-users-status]').html(response.data);
        }
    });
}
//trainer functions
function trainerSetCurrentBoard(team) {
    $('[data-trainer-board!="' + team + '"].board--green').removeClass('board--green');
    $('[data-trainer-board="' + team + '"]').addClass('board--green');
}

function trainerSetNeededGold(gold) {
    if (trainer_user_is_dead) {
        $('[data-trainer-gold]').html('');
        return;
    }

    $('[data-trainer-gold]').html(gold);
}

function trainerSetLocked(locked) {
    if (locked == 'true' || locked === true) {
        $('[data-trainer-lock] i').attr('class', 'ion-ios-locked');
    }
    else {
        $('[data-trainer-lock] i').attr('class', 'ion-ios-unlocked-outline');
    }
}

function trainerPutHeroes(board, hero_pretty_names, hero_real_positions) {
    if (!hero_pretty_names || !hero_pretty_names.length) {
        return;
    }

    if (trainer_user_is_dead) {
        return;
    }

    var html = '<span></span>';
    for (var i = 0; i < hero_pretty_names.length; i++) {
        if (!hero_real_positions[i]) {
            continue;
        }

        var name = hero_pretty_names[i];

        html += '' +
            '<div class="board__div board__div--absolute board__row--' + hero_real_positions[i][1] + ' board__col--' + hero_real_positions[i][0] + '">' +
            '<div class="add-build__hero-inner color-' + colors[hero_costs[name]] + '">' +
            '<div class="icon-' + name.toLowerCase() + '"></div>' +
            name +
            '</div>' +
            '</div>';
    }

    $('[data-trainer-board="' + board + '"]').html(html);
}

function trainerSetUniqueHeroes(unique_heroes) {
    $('[data-trainer-unique-heroes]').html('');

    if (!unique_heroes) {
        return;
    }

    if (trainer_user_is_dead) {
        return;
    }

    var html = '';
    for (var pseudo_name in unique_heroes) {
        var name = unique_heroes[pseudo_name].pretty_name;
        var chance = unique_heroes[pseudo_name].chance;
        if (typeof chance == 'undefined') {
            chance = '&nbsp;';
        }
        else {
            chance += '%';
        }

        html += '' +
            '<div class="add-build__hero-inner color-' + colors[hero_costs[name]] + '" data-trainer-unique-hero="' + name + '">' +
            '<div class="icon-' + name.toLowerCase() + '"></div>' +
            name +
            '<span class="trainer__hero-chance" title="Chance of getting ' + name + ' on the next roll">' + chance + '</span>' +
            '<span class="trainer__hero-pool" title="Amount of ' + name + 's on the map / Total available">' + trainer_all_heroes[pseudo_name].pool + '/' + pool_size[trainer_all_heroes[pseudo_name].cost] + '</span>' +
            '</div>';

        var $added_hero = $('[data-trainer-added-heroes] [data-trainer-added-hero="' + name + '"]');
        if ($added_hero.length) {
            $added_hero.remove();
        }
    }

    $('[data-trainer-unique-heroes]').html(html);
}

function trainerPutEnemyHeroes(team, enemies) {
    if (!enemies) {
        $('[data-trainer-board]').html('<span></span>');
        return;
    }

    for (var i = 1; i < 9; i++) {
        if (team == i) {
            continue;
        }

        if (!enemies[i]) {
            $('[data-trainer-board="' + i + '"]').html('<span></span>');
        }
    }

    for (var enemy_team in enemies) {
        if (enemies[enemy_team].is_dead == 'true' || enemies[enemy_team].is_dead === true) {
            $('[data-trainer-board="' + enemy_team + '"]').html('<span></span>');
            continue;
        }

        if (!enemies[enemy_team].hero_pretty_names || !enemies[enemy_team].hero_pretty_names.length) {
            $('[data-trainer-board="' + enemy_team + '"]').html('<span></span>');
            continue;
        }

        var html = '<span></span>';
        for (var i = 0; i < enemies[enemy_team].hero_pretty_names.length; i++) {
            var name = enemies[enemy_team].hero_pretty_names[i];
            if (!enemies[enemy_team].hero_real_positions[i]) {
                continue;
            }

            html += '' +
                '<div class="board__div board__div--absolute board__row--' + (5 - enemies[enemy_team].hero_real_positions[i][1]) + ' board__col--' + (9 - enemies[enemy_team].hero_real_positions[i][0]) + '">' +
                '<div class="add-build__hero-inner color-' + colors[hero_costs[name]] + '">' +
                '<div class="icon-' + name.toLowerCase() + '"></div>' +
                name +
                '</div>' +
                '</div>';
        }

        $('[data-trainer-board="' + enemy_team + '"]').html(html);
    }
}

function trainerUpdateAddedHeroes() {
    if (trainer_user_is_dead) {
        return;
    }

    $('[data-trainer-added-hero]').each(function () {
        var $this = $(this);
        var pseudo_name = $this.data('trainer-pseudo-name');

        $this.find('span').html(trainer_all_heroes[pseudo_name].chance + '%');
    });
}

function trainerAddHero($hero) {
    var hero = $hero.data('trainer-add-hero');
    var pseudo_name = $hero.data('trainer-pseudo-name');

    //check if hero is already added
    if ($('[data-trainer-added-heroes] [data-trainer-added-hero="' + hero + '"]').length || $('[data-trainer-unique-heroes] [data-trainer-unique-hero="' + hero + '"]').length) {
        return;
    }

    if (!trainer_all_heroes || !trainer_all_heroes[pseudo_name] || !trainer_all_heroes[pseudo_name].chance) {
        return;
    }

    $hero.addClass('trainer__hero-added');
    setTimeout(function () {
        $hero.removeClass('trainer__hero-added');
    }, 3000);

    $('[data-trainer-added-heroes]').append('' +
        '<div class="add-build__hero-inner color-' + colors[hero_costs[hero]] + '" data-trainer-added-hero="' + hero + '" data-trainer-pseudo-name="' + pseudo_name + '">' +
        '<div class="icon-' + hero.toLowerCase() + '"></div>' +
        '<span style="opacity: 0.8">' + hero + '</span>' +
        '<span class="trainer__hero-chance" title="Chance of getting a ' + hero + ' on the next roll">' + trainer_all_heroes[pseudo_name].chance + '%</span>' +
        '<span class="trainer__hero-pool" title="Amount of ' + hero + 's on the map / Total available">' + trainer_all_heroes[pseudo_name].pool + '/' + pool_size[trainer_all_heroes[pseudo_name].cost] + '</span>' +
        '</div>'
    );
}

function trainerSelectBuild($build) {
    $build.find('[data-build-hero-inner]').each(function () {
        var $this = $(this);
        var hero = $this.data('build-hero-inner');
        var pseudo_name = $this.data('trainer-pseudo-name');

        //check if hero is already added
        if ($('[data-trainer-added-heroes] [data-trainer-added-hero="' + hero + '"]').length || $('[data-trainer-unique-heroes] [data-trainer-unique-hero="' + hero + '"]').length) {
            return;
        }

        $('.trainer-select-build-modal').fadeOut(200);

        if (!trainer_all_heroes || !trainer_all_heroes[pseudo_name] || !trainer_all_heroes[pseudo_name].chance) {
            return;
        }

        $('[data-trainer-added-heroes]').append('' +
            '<div class="add-build__hero-inner color-' + colors[hero_costs[hero]] + '" data-trainer-added-hero="' + hero + '" data-trainer-pseudo-name="' + pseudo_name + '">' +
            '<div class="icon-' + hero.toLowerCase() + '"></div>' +
            '<span style="opacity: 0.8">' + hero + '</span>' +
            '<span class="trainer__hero-chance" title="Chance of getting ' + hero + ' on the next roll">' + trainer_all_heroes[pseudo_name].chance + '%</span>' +
            '<span class="trainer__hero-pool" title="Amount of ' + hero + 's on the map / Total available">' + trainer_all_heroes[pseudo_name].pool + '/' + pool_size[trainer_all_heroes[pseudo_name].cost] + '</span>' +
            '</div>'
        );
    });
}

function trainerCheckHeroDead(user_is_dead) {
    if (user_is_dead) {
        $('[data-trainer]').addClass('trainer--user-dead');
    }
    else {
        $('[data-trainer]').removeClass('trainer--user-dead');
    }
}