function markupData (data, type, row, settings) {
	
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
				if(!data[year]) proptional[year] = data[year] /  row[settings['inProprotionTo']][year] * 100;
				else proptional[year] = 0;
			});
			
		var diff = (proptional[2022] - proptional[2001]) ;
		var diff1 = (proptional[2011] - proptional[2001]);
		var diff2 = (proptional[2022] - proptional[2011]);
		
		if (diff > 5) var color = "success"
		else if (diff < -5) var color = "danger"
		else var color = "info"
								
		var markup =
			`<span class="badge text-bg-primary even-larger-badge" title="2022-es adat: ${data[2022].toLocaleString('hu-HU', {maximumFractionDigits: 2})}">
				${proptional[2022].toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span>
			<span class="badge text-bg-${color} even-larger-badge" title="Különbség a 2022-es és a 2001-es adat között.">
				${diff.toLocaleString('hu-HU', {maximumFractionDigits: 2})}</span><br/>
				
			<span class="badge text-bg-secondary" title="2001-es adat: ${data[2001].toLocaleString('hu-HU', {maximumFractionDigits: 2})}">
				${proptional[2001].toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span>&nbsp;
			<span class="badge text-bg-secondary" title="2011-es adat.: ${data[2011].toLocaleString('hu-HU', {maximumFractionDigits: 2})}">
				${proptional[2011].toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span>&nbsp;
			<span class="badge text-bg-light" title="Változás 2001 és 2011 között.">
				${diff1.toLocaleString('hu-HU', {maximumFractionDigits: 2})}</span>
			<span class="badge text-bg-light" title="Változás 2011 és 2022 között.">
				${diff2.toLocaleString('hu-HU', {maximumFractionDigits: 2})}</span>
			`					
		
	} else {
	
		var diff = (data[2022] - data[2001]) / data[2001] * 100;
		var diff1 = (data[2011] - data[2001]) / data[2001] * 100;
		var diff2 = (data[2022] - data[2011]) / data[2011] * 100;
		
		if (diff > 5) var color = "success"
		else if (diff < -5) var color = "danger"
		else var color = "info"
								
		var markup =
			`<span class="badge text-bg-primary even-larger-badge" title="2022-es adat">
				${data[2022].toLocaleString('hu-HU', {maximumFractionDigits: 2})}</span>
			<span class="badge text-bg-${color} even-larger-badge" title="Különbség a 2022-es és a 2001-es adat között: ${(data[2022]-data[2001]).toLocaleString('hu-HU', {maximumFractionDigits: 2})}">
				${diff.toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span><br/>
				
			<span class="badge text-bg-secondary" title="2001-es adat">
				${data[2001].toLocaleString('hu-HU', {maximumFractionDigits: 2})}</span>&nbsp;
			<span class="badge text-bg-secondary" title="2011-es adat">
				${data[2011].toLocaleString('hu-HU', {maximumFractionDigits: 2})}</span>&nbsp;
			<span class="badge text-bg-light" title="Változás 2001 és 2011 között: ${(data[2011]-data[2001]).toLocaleString('hu-HU', {maximumFractionDigits: 2})}">
				${diff1.toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span>
			<span class="badge text-bg-light" title="Változás 2011 és 2022 között: ${(data[2022]-data[2011]).toLocaleString('hu-HU', {maximumFractionDigits: 2})}">
				${diff2.toLocaleString('hu-HU', {maximumFractionDigits: 2})}%</span>
			`
		
	}
	return markup
}