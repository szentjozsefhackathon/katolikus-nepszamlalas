const dataTypes = {
    "2022data": "2022-es adat",
    "2011data": "2011-es adat",
    "2001data": "2001-es adat",
    "diff20012011": "Változás 2001 és 2011 között",
    "diff20112022": "Változás 2011 és 2022 között",
    "diff20012022": "Változás 2001 éss 2022 között"
}

function markup(data, type, row, settings) {
    if (settings["markup"] == "data" || settings["markup"] == "simpleData") {
        settings["markup"] = {
            "2022data": true,
            "2011data": true,
            "2001data": true,
            "diff20012011": settings["markup"] == "data",
            "diff20112022": settings["markup"] == "data",
            "diff20012022": settings["markup"] == "data"
        }
    }

    if (typeof (settings["markup"]) !== "object") {
        settings["markup"] = {
            "2022data": true,
            "2011data": true,
            "2001data": true,
            "diff20012011": true,
            "diff20112022": true,
            "diff20012022": true,
        }
    } else {
        for (const key in Object.keys(dataTypes)) {
            settings["markup"][key] = settings["markup"][key] || false
        }
    }

    if (!data) return '<span class="alert alert-danger">' + settings['data'] + ' is missing!</span>';


    if (settings["inProprotionTo"]) {
        if (!row[settings['inProprotionTo']]) {
            return '<span class="alert alert-danger">' + settings['inProprotionTo'] + ' is missing!</span>';
        }

        var proptional = {};
        (["2001", "2011", "2022"]).forEach(year => {
            if (data) proptional[year] = data[year] / row[settings['inProprotionTo']][year] * 100;
            else {
                return "hibás adat";
            }
        });

        var diff = (proptional[2022] - proptional[2001]);
        var diff1 = (proptional[2011] - proptional[2001]);
        var diff2 = (proptional[2022] - proptional[2011]);

        if (diff > 5) var color = "success"
        else if (diff < -5) var color = "danger"
        else var color = "info"
    }
    else {
        var diff = (data[2022] - data[2001]) / data[2001] * 100;
        var diff1 = (data[2011] - data[2001]) / data[2001] * 100;
        var diff2 = (data[2022] - data[2011]) / data[2011] * 100;

        if (diff > 5) var color = "success"
        else if (diff < -5) var color = "danger"
        else var color = "info"
    }

    var markup = "";


    function getSpan(field) {
        return {
            title: dataTypes[field] + (settings['inProprotionTo'] && field.endsWith("data") ? `: ${data[field.slice(0, 4)]?.toLocaleString('hu-HU', { maximumFractionDigits: 2 }) || ''}` : ''),
            content: field.endsWith("data") 
            ? (settings["inProprotionTo"] ? 
                `${proptional[field.slice(0, 4)]?.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%` 
                : data[field.slice(0, 4)]?.toLocaleString('hu-HU', { maximumFractionDigits: 2 }) || '') 
            : (() => {
                switch (field) {
                    case "diff20012011":
                        return diff1
                    case "diff20112022":
                        return diff2
                    case "diff20012022":
                        return diff
                }
            })()?.toLocaleString('hu-HU', { maximumFractionDigits: 2 }) +( settings['inProprotionTo'] ? "" : '%') 
        }
    }

    if (settings["markup"]["2022data"]) {
        var span = getSpan("2022data")
        markup += `<span class="badge text-bg-primary even-larger-badge" title="${span.title}">${span.content}</span>`
    }
    if (settings["markup"]["diff20012022"]) {
        var span = getSpan("diff20012022")
        markup += `<span class="badge text-bg-${color} even-larger-badge" title="${span.title}">${span.content}</span><br/>`
    }
    if (settings["markup"]["2001data"]) {
        var span = getSpan("2001data")
        markup += `<span class="badge text-bg-secondary" title="${span.title}">${span.content}</span>&nbsp;`
    }
    if (settings["markup"]["2011data"]) {
        var span = getSpan("2011data")
        markup += `<span class="badge text-bg-secondary" title="${span.title}">${span.content}</span>&nbsp;`
    }
    if (settings["markup"]["diff20012011"]) {
        var span = getSpan("diff20012011")
        markup += `<span class="badge text-bg-light" title="${span.title}">${span.content}</span>`
    }
    if (settings["markup"]["diff20112022"]) {
        var span = getSpan("diff20112022")
        markup += `<span class="badge text-bg-light" title="${span.title}">${span.content}</span>`
    }
				


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
    return markup
}