define(['jquery', 'underscore', 'backbone', "tpl!components/templates/preview_card.tpl"], function($, _, Backbone, previewCardTpl) {

	var previewCardTimeout,
        hideTimeout,
	    cache = {};

	var entities = {
		person: function(element) {
			var rel = $(element).attr('rel'),
			    cached;

			if (cached = cache[rel]) {
                $("#preview-card").html(cached);
			} else {
				$.ajax({
                    type: "POST",
					url : CSF.config.PREVIEW_CARD_URL,
					dataType : "jsonp",
                    jsonp: 'callback',
                    jsonpCallback: "jsonCallback",
					data : {
						id : rel
					},
					success : function (data) {
						var response = data && data.response,
                            errors = response && response.errors,
                            personHtml;

						if (errors && errors.length) {
							personHtml = '<div class="persion-preview">'+ errors[0] +'</div>';
						} else {
							var person = response.people[0];
                            var fileName = getDomainFromSiteCode(person.site_code);

                            var options = {
                                fileName: fileName,
                                unique_id: person.unique_id,
                                profile: (person.e_mail ? person.e_mail.split('@')[0] : person.firstname + '.' + person.lastname),
                                firstname: person.firstname,
                                lastname: person.lastname,
                                site_name: person.site_name,
                                workplace: person.workplace,
                                phone: person.phone,
                                e_mail: person.e_mail
                            };

                            personHtml = previewCardTpl(options);
						}

						cache[rel] = personHtml;

                        $("#preview-card").html(personHtml);
					}
				});
			}
		}
	};



    //  todo - make reusable component later
    (function () {
        var htmlCard = '<div id="preview-card" class="preview-card content content-text rounded-panel"></div>';

        var init = function (ctx) {
            var opt = {
                width: 350,
                height: 'auto',
                content: function () {
                },
                entity: 'person',
                delay: 150
            };

            // Create and initialize the preview card element
            $("body").append(htmlCard);

            //  re-query every time
            $("#preview-card")
                    .on('mouseenter', function (e) {
                        clearTimeout(hideTimeout);
                    })
                    .on('mouseleave', function (e) {
                        hideTimeout = setTimeout(function () {
                            $("#preview-card").fadeOut();
                        }, opt.delay);
                    });

            return ctx.each(function () {
                    var $obj = $(this);

                    $obj.on('mouseover', function (e) {
                            previewCardTimeout = setTimeout(function () {
                                clearTimeout(hideTimeout);

                                var $spc = $("#preview-card");

                                $spc.empty();

                                // run the method that generates the content
                                if (opt.entity != null) {
                                    entities[opt.entity]($obj);
                                } else {
                                    opt.content($obj);
                                }

                                $spc.width(opt.width)
                                    .height(opt.height)
                                    .show();

                                // get hovered element's position
                                var pos = $(this).offset();
                                // get the document's scroll position
                                var vScrollPosition = $(document).scrollTop();
                                // get the right-most width of the page
                                var limitRight = $(window).width() - opt.width;
                                // get the bottom-most height of the page
                                var limitBottom = (vScrollPosition + $(window).height()) - $spc.outerHeight();
                                // mouse's horizontal position
                                var posHorizontal = e.pageX;
                                // mouse's vertical position
                                var posVertical = e.pageY;
                                // these offsets give the cursor some breathing room
                                var offsetHorizontal = 10;
                                var offsetVertical = 10;

                                // if cursor is less than opt.width pixels away from right window border, show card to left of cursor
                                if (posHorizontal > limitRight) {
                                    posHorizontal = e.pageX - $spc.outerWidth();
                                    offsetHorizontal = -10;
                                }

                                // if cursor is less than opt.height pixels away from bottom window border, show card above cursor
                                if (posVertical > limitBottom) {
                                    posVertical = posVertical - $spc.outerHeight();
                                    offsetVertical = -10;
                                }

                                // show it with the spinner
                                $spc.css('top', posVertical + offsetVertical)
                                    .css('left', posHorizontal + offsetHorizontal);
                            }, opt.delay);
                        }
                    )
                        .on('mouseout', function (e) {
                            clearTimeout(previewCardTimeout);

                            hideTimeout = setTimeout(function () {
                                $('#preview-card').fadeOut();
                            }, 300);
                        });

                });
        };

        $.fn.extend({
            previewCard: function () {
                return init(this);
            }
        });
    }());

    function getDomainFromSiteCode(siteCode) {
        var mapping = {
            'us' : 'NANET', // USA USA USA
            'ca' : 'NANET', // Canada
            'br' : 'LANET', // Brazil
            'mx' : 'LANET', // Mexico
            'ar' : 'LANET', // Argentina
            'be' : 'EUNET', // Belgium
            'ch' : 'EUNET', // Switzerland
            'it' : 'EUNET', // Italy
            'gb' : 'EUNET', // Great Britain
            'fr' : 'EUNET', // France
            'at' : 'EUNET', // Austria
            'es' : 'EUNET', // Spain
            'hu' : 'EUNET', // Hungary
            'de' : 'EUNET', // Germany (deutchland)
            'dk' : 'EUNET', // Denmark
            'eg' : 'EUNET', // Egypt
            'fi' : 'EUNET', // Finland
            'gr' : 'EUNET', // Greece
            'nl' : 'EUNET', // Netherlands
            'no' : 'EUNET', // Norway
            'pl' : 'EUNET', // Poland
            'pt' : 'EUNET', // Portugal
            'ru' : 'EUNET', // Russia
            'se' : 'EUNET', // Sweden
            'tr' : 'EUNET', // Turkey
            'ke' : 'EUNET', // Turkey
            'au' : 'APNET', // Australia
            'ph' : 'APNET', // Philippines
            'bd' : 'APNET', // Bangladesh
            'sg' : 'APNET', // Singapore
            'cn' : 'APNET', // China
            'id' : 'APNET', // Indonesia
            'jp' : 'APNET', // Japan
            'kr' : 'APNET', // Korea
            'in' : 'APNET', // India
            'vn' : 'APNET', // Vietnam
            'tw' : 'APNET' // Taiwan
        };
        // Default to NANET if site code doesn't exist
        return mapping[siteCode.substring(0, 2)] ? mapping[siteCode.substring(0, 2)] : 'NANET';
    }

});