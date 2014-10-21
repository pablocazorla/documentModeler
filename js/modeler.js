// Modeler
Modeler = {};
Modeler.$currentItem = null;
Modeler.$currentMenu = null;
Modeler.hash = null;

Modeler.toCamel = function(str) {
	var capitalize = function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	var arryStr = str.split(' '),
		camelStr = arryStr[0];
	for (var i = 1; i < arryStr.length; i++) {
		camelStr += capitalize(arryStr[i]);
	}
	return camelStr;
};
Modeler.parseHtml = function(h) {
	var parsetoArray = function(preHtml, level, cssClass) {
		var arr = [],
			cssClass = cssClass || 'level',
			tag = '<h' + level + '>',
			index = 0,
			preIndex = 0,
			htmlToParse = preHtml,
			first = true,
			running = true;
		while (running) {
			index = htmlToParse.indexOf(tag, preIndex);
			if (index === -1) {
				var s = htmlToParse.substring(preIndex - 1);
				running = false;
			} else {
				var s = htmlToParse.substring(preIndex - 1, index);
				preIndex = index + 1;
			}
			if (s.length > 0) {
				if (!first) {
					s = '<div class="' + cssClass + '">' + s + '</div>';
				}
				arr.push(s);
				first = false;
			}
		}
		return arr;
	};

	var a1 = parsetoArray(h, 1, 'page');

	for (var i = 0; i < a1.length; i++) {

		var a2 = parsetoArray(a1[i], 2, 'theme');
		for (var ib = 0; ib < a2.length; ib++) {
			var a3 = parsetoArray(a2[ib], 3, 'item');
			a2[ib] = a3.join('');
		}
		a1[i] = a2.join('');
	}
	return a1.join('');
};
Modeler.renderMenu = function($container) {
	var $sidebar = $('#document-sidebar'),
		idCounter = 0,
		firstH3 = true;

	$container.find('.page').each(function() {
		var $page = $(this),
			$h1 = $page.find('h1'),
			titleH1 = $h1.eq(0).text(),
			link = Modeler.toCamel(titleH1),
			$linkMenu = $('<div class="menu-title1">' + titleH1 + '</div>');

		$h1.remove();

		$page.attr('id', link);

		$sidebar.append($linkMenu);

		$page.find('.theme').each(function() {
			var $theme = $(this),
				$h2 = $theme.find('h2'),
				titleH2 = $h2.eq(0).text(),
				link = Modeler.toCamel(titleH2),
				$linkMenu = $('<div class="menu-title2">' + titleH2 + '</div>');

			$h2.remove();

			$theme.attr('id', link);

			$sidebar.append($linkMenu);



			$theme.find('.item').each(function() {
				var $item = $(this),
					titleH3 = $item.find('h3').eq(0).text(),
					link = Modeler.toCamel(titleH3) + '-' + idCounter++,
					$linkMenu = $('<a class="menu-title3" href="#' + link + '">' + titleH3 + '</a>');
				$item.attr('id', link).prepend($('<div class="bread"><span class="bread1">' + titleH1 + '</span><span class="bread2">' + titleH2 + '</span></div>'));
				$sidebar.append($linkMenu);

				if (firstH3) {
					Modeler.$currentItem = $item;
					Modeler.$currentMenu = $linkMenu;
					firstH3 = false;
				}
			});
		});
	});

	var $itemHash = $(Modeler.hash);
	if ($itemHash.length > 0) {
		Modeler.$currentItem = $itemHash;
		$sidebar.find('.menu-title3').each(function(){
			if($(this).attr('href') === (Modeler.hash)){
				Modeler.$currentMenu = $(this);
			}
		});
	}
	Modeler.$currentItem.addClass('current');
	Modeler.$currentMenu.addClass('current');

	return $sidebar;
};



$('document').ready(function() {

	Modeler.hash = window.location.hash;


	var $container = $('#document-content');

	var h = $container.html();
	$container.html(Modeler.parseHtml(h));

	$sidebar = Modeler.renderMenu($container);



	$sidebar.find('.menu-title3').click(function(e) {
		e.preventDefault();
		Modeler.$currentMenu.removeClass('current');
		Modeler.$currentItem.removeClass('current');
		Modeler.$currentMenu = $(this).addClass('current');
		var id = Modeler.$currentMenu.attr('href');
		Modeler.$currentItem = $(id).addClass('current');
		window.location.hash = id;
		$(window).scrollTop(0);

	});

	$container.addClass('rendered');
});