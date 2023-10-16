sections.push('publishChart');

var chart1;

if (!$("#container_chart").length) {
	$("#sections").append(`<div class="container float-end" id="container_chart" style="display: none">
			<h2 class="chart-title">Összehasonlító diagram</h2>
			<p>Itt egyetlen nagy diagramban hasonlíthatjuk össze az adatokat. A <a href="#config">Beállítások</a> részben megadott területek adatai kerülnek csak kijelzésre. Az elérhető - és kattintásra ki- és bekapcsolható - adattagokat pedig szintén a <a href="#config">Beállítások</a> részben elérhető JSON formában adhatjuk meg. Az atadok pedig mindig a 2022-es százalékos adatokból készül, melynél egy sima adattagot (nincs arányosítva, nincs diagramra téve) hasonlítunk össze az össznépességgel.</p>
			<canvas id="chart"></canvas>
		</div>
		<div class="b-example-divider float-end"></div>`
	);
}

function publishChart(filteredData, settings) {
	var chart = document.getElementById('chart');
	const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
	const pieDoughnutLegendClickHandler = Chart.controllers.doughnut.overrides.plugins.legend.onClick;
	if (chart1) chart1.destroy()
	document.getElementById("container_chart").style.display = "block"
	chart1 = new Chart(chart, {
		type: "bar",
		data: {
			labels: filteredData.map(d => d.name),
			datasets: settings.filter(c => {
				return typeof c["data"] === "string" && !c["inProprotionTo"]
			}).map(c => {
				if (colls.findIndex(col => col == c["data"]) == -1) {
					return {
						label: c['data'],
						hidden: true,
						data: []
					}
				}


				return {
					label: getLabel(c['data']) || c['data'],
					data: filteredData.map(function (item) {

						return item.data[c['data']] ? (item.data[c['data']]["2022"] / item.data["TOTAL"]["2022"]) * 100 : "false"
					}),
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