class Card {
	
	setTitle(string) {
		this.title = string
	}

	setSelectorId(string) {
		this.selectorId = string
	}

	prepare() {
	}
	
	publish() {
		this.prepare()
		
	$('#' + this.selectorId + ' .content').append( '<div class="card float-start" style="width: 18rem;">' +
  '<div class="card-body">' +
   ' <h5 class="card-title">' + this.title + '</h5>' +
   ' <!--<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>-->' +
   this.content + 
   '<!-- <a href="#" class="card-link">Card link</a>' +
   ' <a href="#" class="card-link">Another link</a>-->' +
  '</div>' +
'</div>');
		
	}
	
}

class LabelCard extends Card {
	
}

class DataCard extends Card {
	
	setData(data, string) {
		if ( string in dictionary  ) {
			if ( dictionary[string]['name']) this.label = dictionary[string]['name'];
			else this.label = dictionary[string];			
		} else
			this.label = string
		this.title = this.label;
		this.data = string
		this.allData = data;
		
	}
	
	prepare() {
		this.content = 'Valami'
		var tmp = this.allData[this.data];
		
		var markup = '';
		if ( ! tmp) {
			this.content = "Hibás / ismeretlen adat";
			return;
		}
		
		
		markup += '<span class="badge text-bg-primary even-larger-badge" title="2022-es KSH adat">' + tmp[2022].toLocaleString('hu-HU') + '</span>';
						var diff = (tmp[2022] - tmp[2001]) / tmp[2001] * 100;
						if (diff > 5) var color = "success";
						else if (diff < -5) var color = "danger";
						else var color = "info"
						markup += ' <span class="badge text-bg-' + color + ' even-larger-badge" title="Különbség a 2022-es és a 2001-es KSH adat között.">' + diff.toFixed(2) + '%</span>';

						var diff1 = (tmp[2011] - tmp[2001]) / tmp[2001] * 100;
						var diff2 = (tmp[2022] - tmp[2011]) / tmp[2011] * 100;
						markup += '<br/><span class="badge text-bg-secondary" title="2001-es KSH adat">' + tmp[2001].toLocaleString('hu-HU') + '</span>&nbsp;<span class="badge text-bg-secondary" title="2011-es KSH adat">' + tmp[2011].toLocaleString('hu-HU') + '</span>&nbsp;<span class="badge text-bg-light" title="Változás 2001 és 2011 között.">' + diff1.toFixed(2) + '%</span><span class="badge text-bg-light" title="Változás 2011 és 2022 között.">' + diff2.toFixed(2) + '%</span>';
		this.content = markup;
		
	}
}