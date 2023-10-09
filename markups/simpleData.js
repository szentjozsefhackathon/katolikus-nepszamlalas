function markupSimpleData (data, type, row, settings) {

	if(!data) return '<span class="alert alert-danger">' + settings['data'] + ' is missing!</span>';
								
	// A dataTable sorrendiségéhez szükséges. Nem lehetne innen kiszervezni?
	if (type == "sort" || type == 'type') {
		switch (document.getElementById("selectOrder1").value) {
			case "2022data":
				return data["2022"]

			case "2011data":
				return data["2011"]

			case "2001data":
				return data["2001"]

			case "diff20012011":
				return diff1

			case "diff20112022":
				return diff2

			case "diff20012022":
				return diff

		}
	}
	
	if(settings['inProprotionTo']) {
		if(!row[settings['inProprotionTo']]) {
			return '<span class="alert alert-danger">' + settings['inProprotionTo'] + ' is missing!</span>';
		}
		var proptional = {};
			(["2001","2011","2022"]).forEach(year => {
				proptional[year] = data[year] /  row[settings['inProprotionTo']][year] * 100;
			});
		
		
		var markup =
			`<span class="badge text-bg-primary even-larger-badge" title="${data[2022].toLocaleString('hu-HU', {maximumFractionDigits: 2})} (2022-es adat)">
				${proptional[2022].toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span><br/>
			<span class="badge text-bg-secondary" title="${ data[2001] ? data[2001].toLocaleString('hu-HU', {maximumFractionDigits: 2}) : "undefined"} (2001-es adat)">
				${proptional[2001].toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span>&nbsp;
			<span class="badge text-bg-secondary" title="${data[2011] ? data[2011].toLocaleString('hu-HU', {maximumFractionDigits: 2}) : "undefined"} (2011-es adat)">
				${proptional[2011].toLocaleString('hu-HU', {maximumFractionDigits: 2})}%
			</span>&nbsp;`						
		
	} else {
		var markup =`<span class="badge text-bg-primary even-larger-badge" title="2022-es adat">
				${data[2022] ? data[2022].toLocaleString('hu-HU', {maximumFractionDigits: 2}) : "undefined" }</span><br/>		
			<span class="badge text-bg-secondary" title="2001-es adat">
				${ data[2001] ? data[2001].toLocaleString('hu-HU', {maximumFractionDigits: 2}) : "undefined"}</span>&nbsp;
			<span class="badge text-bg-secondary" title="2011-es adat">
				${ data[2011] ? data[2011].toLocaleString('hu-HU', {maximumFractionDigits: 2}) : "undefined"}
			</span>&nbsp;`						
	}
	return markup
}

