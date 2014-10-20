// Modeler
$('document').ready(function() {
	var $container = $('#document-content');

	var prehtml = $container.html();



	var strA = '<section>';
	var strB = '</section>';
	var html = '';
	var partHtml = '';
	var preIndex = 0;
	var index = 0;


	//trim
	index = prehtml.indexOf('<h2>', preIndex);

	prehtml = prehtml.substring(index);

	//parse
	while (preIndex < prehtml.length) {
		index = prehtml.indexOf('<h2>', preIndex);

		if (index === -1) {
			partHtml = strB+strA + prehtml.substring(preIndex - 1);
			html += partHtml;
			preIndex = prehtml.length + 1;
		} else {
			partHtml = ((index > 0) ? strB+strA : '') + prehtml.substring(preIndex - 1, index);


			html += partHtml;

			preIndex = index + 1;
		}
		
	}
	html = html.substring(strB.length) + strB;

	console.log(html);

$container.html(html);
});