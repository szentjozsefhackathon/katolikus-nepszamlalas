sections.push('publishDashboard');

if( ! $("#container_dashboard").length ) {
	$("#sections").append(`<div id="container_dashboard" class="float-end" style="display: none">
			<h2 class="chart-title">Egyházmegyénkénti Dashboard</h2>
			
			<div id="dashboard"  class="">
				<div class="description"></div>
				<div class="settings"></div>
				<div class="content card-columns">
					<i>Content is coming...</i>
				</div>
				<div class=""></div>			
			</div>
		<div class="b-example-divider float-end"></div>`
		);
}
		

function publishDashboard (filteredData, settings) {
	
	document.getElementById("container_dashboard").style.display = "block";
	$('#dashboard .content').html('')
		
	if(!$('#dashboard .select').length) { 
		var _markup = "<select id='dashboard_select' class='select' onchange='reRender()'>";		
		for (let i = 0; i < Object.values(filteredData).length; i++) {
			
			_markup += "<option value=\"" + filteredData[Object.keys(filteredData)[i]]['osmid'] + "\">" + filteredData[Object.keys(filteredData)[i]]['name'] + "</option>"
		}
		_markup += "</select>";

		$("#dashboard .settings").html(_markup);
	}
	
	
	var osmid = $("#dashboard_select option:selected" )[0].value;
	
	var id;
	Object.entries(filteredData).forEach(([key, value]) => {
		if ( value['osmid'] == osmid ) {
			id = key;
			return
		}
	});
			
	const data = filteredData[id];
	
	$("#dashboard .content").append(` <div class="card" style="width: 18rem;">
	  <div class="card-body">
		<h5 class="card-title">` + data['name'] + `</h5>
		<h6 class="card-subtitle mb-2 text-_markupted">Ez egy remek hely.</h6>
		<p class="card-text">Bármi összefoglaló leírás itten.</p>	
	  </div>
	</div>`);
	
	for (const [key, value] of Object.entries(settings)) {
		
		var _markup = markup(data['data'][value['data']], false, data['data'], value)
	
		var subtitle = "";
		if(value['inProprotionTo']) subtitle =`
			<h6 class="card-subtitle mb-2 text-_markupted" title="${subtitle}">
				Arányosítva: ${getLabel(value['inProprotionTo'])}</h6>`;
		
		
		$("#dashboard .content").append(` <div class="card float-start" style="width: 18rem;">
		  <div class="card-body">
			<h5 class="card-title" title="` + value['data'] + `">` + getLabel(value['data']) + `</h5>
			${subtitle}
			` + _markup + `
		  </div>
		</div>`);
		
	}
	
}


