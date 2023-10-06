
class AreaSection {
	
	constructor(fullData, colls) {
		this.fullData = fullData;
		this.colls = colls;
		this.id = "areaSection"
		this.title = "Adatok egy-egy egyházmegyére lebontva";
	}
	
	setAreaId(string) {
		this.areaId = string
	}
	
	publish() {
		if(!$('#' + this.id).length) { 
			this.createSection();
		}
		
		$("#" + this.id + " .content").html("");
		
		
		if(!$('#' + this.id + ' .select').length) { 
			var markup = "<select class='select'>";		
			for (let i = 0; i < Object.values(this.fullData).length; i++) {
				
				markup += "<option value=\"" + fullData[Object.keys(fullData)[i]]['osmid'] + "\">" + fullData[Object.keys(fullData)[i]]['name'] + "</option>"
			}
			markup += "</select>";
			/*
			var markup = "Választható mezők: ";
			for (let i = 0; i < colls.length; i++) {
				markup += ' <button type="button" class="btn btn-primary">' + colls[i] + "</button> ";
			}		
			$('#' + this.id + ' .header').append(markup);
			*/
			$("#" + this.id + " .settings").html(markup);
		}
		
		const area = this.fullData[this.areaId];
				
		var title = new LabelCard();		
		title.setTitle(area['name']);
		title.setSelectorId(this.id);
		title.publish();

		var datacards = ["NEME_SEX","RE_C","DIV_DISREP:RE_C","DIV_DISREP","RE_CD","SIN","SIN:RE_C"];
		for (let i = 0; i < datacards.length; i++) {			
			var title = new DataCard();
			title.setData(area['data'],datacards[i])
			title.setSelectorId(this.id);
			title.publish();
		}

	
	}


	/* Ez majd mehetne egy központiba, amiból extends */
	createSection() {
		$("#sections").append('<section id="' + this.id + '" class="float-end" >' +
		'<div class="header"><h2>' + this.title + '</h2></div>' + 
		'<div class="description"></div>' +
		'<div class="settings"></div>' +
		'<div class="content card-columns">' +
		'<i>Content of </i>' + this.id + '<i> is coming...</i>' +
		'</div><div class=""></div></section><br/><br/><hr/>');
		
		
	}

	

}

