
class Section {
	
	constructor() {
	}
	
	createSection() {
		$("#sections").append('<section id="' + this.id + '">' +
		'<div class="header"><h2>' + this.title + '</h2></div>' + 
		'<div class="content">' +
		'<i>Content of </i>' + this.id + '<i> is coming...</i>' +
		'</div></section>');
		console.log("ok");
		
	}
}

