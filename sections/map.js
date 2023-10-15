sections.push('publishMap');

if (!$("#container_map").length) {
    $("#sections").append(`<div class="container float-end" id="container_map">
            <h2>Térkép</h2>
            <label for="mapData">Megjelenített adat</label>
            <select id="mapData" class="form-control" onchange="publish('publishMap')"></select>
            <label for="mapInProprotionTo">Arányosítva ehhez</label>
            <select id="mapInProprotionTo" class="form-control" onchange="publish('publishMap')"></select>
            <label for="mapColoring">Színezés alapja</label>
			<select class="form-control" id="mapColoring" onchange="publish('publishMap')">
				<option value="2022data">2022-es KSH adatok</option>
				<option value="2011data">2011-es KSH adatok</option>
				<option value="2001data">2001-es KSH adatok</option>
				<option value="diff20012011">Változás 2001 és 2011 között</option>
				<option value="diff20112022">Változás 2011 és 2022 között</option>
				<option value="diff20012022">Változás 2001 és 2022 között</option>
			</select>
            <div class="form-check form-switch form-check-inline">
                <input class="form-check-input" type="checkbox" id="switchMapInfo" checked onclick="publish('publishMap')">
                <label class="form-check-label" for="switchMapInfo">Információk</label>
            </div>
            <div class="form-check form-switch form-check-inline">
                <input class="form-check-input" type="checkbox" id="switchMapLegend" checked onclick="publish('publishMap')">
                <label class="form-check-label" for="switchMapScale">Skála</label>
            </div>
            <div class="form-check form-switch form-check-inline">
                <input class="form-check-input" type="checkbox" id="switchMapTitle" checked onclick="publish('publishMap')">
                <label class="form-check-label" for="switchMapTitle">Cím</label>
            </div>
            <div class="form-check form-switch form-check-inline">
            <input class="form-check-input" type="checkbox" id="switchMapMap" checked onclick="publish('publishMap')">
            <label class="form-check-label" for="switchMapMap">Térkép</label>
        </div>
			<div id="map" style="height: 800px"></div>
		</div>
		<div class="b-example-divider float-end"></div>`
    );
}

var map;


var color = {
    max: 100,
    min: -100
}

function publishMap(filteredData, settings) {
    if (map) {
        map.remove()
        $("#map").html("")

    }
    color.min = Math.min(...(filteredData.map(d => Markup.callMarkup(d.data[$("#mapData option:selected")[0]?.value || "RE_C"], "sort", { diocese: d.name, ...d.data }, { data: $("#mapData option:selected")[0]?.value || "RE_C", inProprotionTo: $("#mapInProprotionTo option:selected")[0]?.value || "TOTAL" }, "mapColoring")).filter(d => !isNaN(d))))
    color.max = Math.max(...(filteredData.map(d => Markup.callMarkup(d.data[$("#mapData option:selected")[0]?.value || "RE_C"], "sort", { diocese: d.name, ...d.data }, { data: $("#mapData option:selected")[0]?.value || "RE_C", inProprotionTo: $("#mapInProprotionTo option:selected")[0]?.value || "TOTAL" }, "mapColoring")).filter(d => !isNaN(d))))

    map = L.map('map', {zoomControl: false }).setView([47.134, 19.693], 8);
    if($("#switchMapMap").is(":checked")) L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 8,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.dragging.disable();

	const title = L.control({position: 'topleft'});
    title.onAdd = function (map) {
		const dataType = $("#mapData option:selected")[0]?.value || "RE_C";
		const inProprotionToType = $("#mapInProprotionTo option:selected")[0]?.value || "TOTAL";
		const mapColoring = $("#mapColoring option:selected")[0]?.innerHTML || "2022-es KSH adatok" ;
		
        const div = L.DomUtil.create('div', 'info title');		
        div.innerHTML = "<h2><strong>„" + getLabel(dataType) + "”</strong> személyek létszáma <br/> a(z) <strong>„" + getLabel(inProprotionToType) + "”</strong> arányában</h2>";
		div.innerHTML += "<h4><strong>" + mapColoring + "</strong></h4>";
		return div;
        
    };
	if($("#switchMapTitle").is(":checked")) title.addTo(map);
	

    // control that shows state info on hover
    const info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };


    info.update = function (props) {
        if(!$("#switchMapInfo").is(":checked")) return
        var HU = filteredData.find(d => d.name == "Magyarország")
        HU = {diocese: HU.name, ...HU.data}
        const _HU = Markup.callMarkup(HU[$("#mapData option:selected")[0]?.value || "RE_C"], "data", HU, { data: $("#mapData option:selected")[0]?.value || "RE_C", inProprotionTo: $("#mapInProprotionTo option:selected")[0]?.value || "TOTAL"})
        var d = props ? filteredData.find(d => d.name.toLowerCase() == props.name.toLowerCase()) : null
        if (d) {
            d = { diocese: d.name, ...d.data }
        }
        const markup = props ? Markup.callMarkup(d[$("#mapData option:selected")[0].value], "data", d, { data: $("#mapData option:selected")[0].value, inProprotionTo: $("#mapInProprotionTo option:selected")[0].value }) : ""
        const contents = props ? `<h4>${props.name}</h4>${markup}` : 'Irányítsa a kurzort egy egyházmegye fölé';

        this._div.innerHTML = `${contents}<br><h5>Magyarország</h5>${_HU}`;
    };

    if($("#switchMapInfo").is(":checked")) info.addTo(map);


    function getColor(value) {
        function RGB2HTML(red, green, blue) {
            red = Math.floor(Math.max(Math.min(255, red), 0))
            green = Math.floor(Math.max(Math.min(255, green), 0))
            blue = Math.floor(Math.max(Math.min(255, blue), 0))
            var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
            return '#' + decColor.toString(16).substr(1);
        }

        var retCol;
        if (color.min < 0 && color.max > 0) {
            retCol = value < 0 ? RGB2HTML(255, value * (255 / (color.min * (-1))), value * (255 / (color.min * (-1)))) :
                value > 0 ? RGB2HTML(255 - value * (255 / color.max), 255, 255 - value * 255 / color.max) : "#FFFFFF"
        }
        else if (color.min > 0 && color.max <= 100) {
            retCol = RGB2HTML(
                255 - (value - color.min) * (255 / (color.max - color.min)),
                255,
                255 - (value - color.min) * (255 / (color.max - color.min)))
        }
        else if (color.min > 0 && color.min < 100 && color.max >= 100) {
            retCol = value < 100 ? RGB2HTML(
                255,
                (value - color.min) * (255 / (100 - color.min)),
                (value - color.min) * (255 / (100 - color.min))) :
                color.max == 100 ? "#FFFFFF" : RGB2HTML(
                    255 - ((value - 100) * (255 / (color.max - 100))),
                    255,
                    255 - ((value - 100) * (255 / (color.max - 100))))
        }
        else if (color.min >= 100) {
            retCol = RGB2HTML(
                255 - (value - color.min) * (255 / (color.max - color.min)),
                255,
                255 - (value - color.min) * (255 / (color.max - color.min)))
        }
        else if (color.max < 0) {
            retCol = RGB2HTML(
                255,
                (value - color.min) * (255 / (color.max - color.min)),
                (value - color.min) * (255 / (color.max - color.min)))
        }

        return retCol

    }

    function getValue(name) {
        var d = filteredData.find(d => d.name.toLowerCase() == name.toLowerCase())
        if (d) {
            d = { diocese: d.name, ...d.data }
        }
        const value = Markup.callMarkup(d[$("#mapData option:selected")[0]?.value || "RE_C"], "sort", d, { data: $("#mapData option:selected")[0]?.value || "RE_C", inProprotionTo: $("#mapInProprotionTo option:selected")[0]?.value || "NEME_SEX" }, "mapColoring")
        return value
    }

    function style(feature) {
        return {
            fillColor: getColor(getValue(feature.properties.name)),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        layer.bringToFront();

        info.update(layer.feature.properties);
    }

    /* global statesData */
    const geojson = L.geoJson(dioceses_osm, { style: style, onEachFeature: onEachFeature }).addTo(map);


    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }


    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const HOWMANYCOLOR = 10
        const grades = []
        for (var i = 0; i < HOWMANYCOLOR; i++) {
            grades.push(color.min + i * ((color.max - color.min) / HOWMANYCOLOR))
        }
        const labels = [];


        for (let i = 0; i < grades.length; i++) {
            labels.push(`<i style="background:${getColor(grades[i])}"></i>${Math.floor(grades[i])}%`);
        }
        labels.push("A színskála nem tartalmaz minden színt, csak az arányokat.")

        div.innerHTML = labels.join('<br>');
        return div;
    };

    if($("#switchMapLegend").is(":checked")) legend.addTo(map);

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
}