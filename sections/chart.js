sections.push('publishChart');

var chart1;

if( ! $("#container_chart").length ) {
	$("#sections").append(`<div class="container float-end" id="container_chart" style="display: none">
			<h2 class="chart-title">KSH adatok vizualizálva</h2>
			<p>A diagram a 2022-es százalékos adatokból készült. Amennyiben a jelmagyarázatnál a címkékre ráklikkel,
				akkor
				változtathatja az oszlopok láthatóságát és ez kihatással lesz a táblázatokra is.</p>
			<canvas id="chart"></canvas>
		</div>
		<div class="b-example-divider float-end"></div>`
		);
}

function publishChart(filteredData, colls) {
		var chart = document.getElementById('chart');
		const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
			const pieDoughnutLegendClickHandler = Chart.controllers.doughnut.overrides.plugins.legend.onClick;
			if (chart1) chart1.destroy()
			document.getElementById("container_chart").style.display = "block"
			chart1 = new Chart(chart, {
				type: "bar",
				data: {
					labels: filteredData.map(d => d.name),
					datasets: colls.filter(c => c != "NEME_SEX" && getLabel(c)).map(c => {
						return {
							label: getLabel(c) || "Ismeretlen",
							data: filteredData.map(d => (d.data[c]["2022"] / d.data["NEME_SEX"]["2022"]) * 100),
							hidden: !settings.includes(c)
						}
					})
				},
				options: {
					plugins: {
						legend: {
							onClick: (evt, legendItem, legend) => {
								const type = legend.chart.config.type;

								if (type === 'pie' || type === 'doughnut') {
									pieDoughnutLegendClickHandler(evt, legendItem, legend)
								} else {
									defaultLegendClickHandler(evt, legendItem, legend);
								}


							}
						},
					}
				}
			})

	}