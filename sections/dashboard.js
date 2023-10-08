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
		

function publishDashboard (filteredData, colls) {
	
	document.getElementById("container_dashboard").style.display = "block";
	$('#dashboard .content').html('')
		
	if(!$('#dashboard .select').length) { 
		var markup = "<select id='dashboard_select' class='select' onchange='reRender()'>";		
		for (let i = 0; i < Object.values(filteredData).length; i++) {
			
			markup += "<option value=\"" + filteredData[Object.keys(filteredData)[i]]['osmid'] + "\">" + filteredData[Object.keys(filteredData)[i]]['name'] + "</option>"
		}
		markup += "</select>";

		$("#dashboard .settings").html(markup);
	}
	
	
	var cards = colls.filter(c => getLabel(c) && settings.includes(c));

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
		<h6 class="card-subtitle mb-2 text-muted">Ez egy remek hely.</h6>
		<p class="card-text">Bármi összefoglaló leírás itten.</p>	
	  </div>
	</div>`);
	
	for ( var i = 0; i < cards.length; i++) {
		$("#dashboard .content").append(` <div class="card float-start" style="width: 18rem;">
		  <div class="card-body">
			<h5 class="card-title">` + getLabel(cards[i]) + `</h5>
			<h6 class="card-subtitle mb-2 text-muted">` + cards[i] + `</h6>
			` + markupData (data['data'][cards[i]], false , data ) + `
		  </div>
		</div>`);
	}
	
}


