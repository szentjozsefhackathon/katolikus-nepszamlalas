class DataMarkup extends Markup {
    render() {
        if (!this.data) return '<span class="alert alert-danger">' + this.settings['data'] + ' is missing!</span>';

        // A dataTable sorrendiségéhez szükséges. Nem lehetne innen kiszervezni?
        if (this.type == "sort" || this.type == 'type') {
            switch (document.getElementById(this.orderSelect).value) {
                case "2022data":
                    return this.data["2022"]

                case "2011data":
                    return this.data["2011"]

                case "2001data":
                    return this.data["2001"]

                case "diff20012011":
                    return diff1

                case "diff20112022":
                    return diff2

                case "diff20012022":
                    return diff

            }
        }

        if (this.settings['inProprotionTo']) {
            if (!this.row[this.settings['inProprotionTo']]) {
                return '<span class="alert alert-danger">' + this.settings['inProprotionTo'] + ' is missing!</span>';
            }

            var proptional = {};
            (["2001", "2011", "2022"]).forEach(year => {
                if (this.data) proptional[year] = this.data[year] / this.row[this.settings['inProprotionTo']][year] * 100;
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

            var markup =
                `<span class="badge text-bg-primary even-larger-badge" title="2022-es adat: ${this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${proptional[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>
                <span class="badge text-bg-${color} even-larger-badge" title="Különbség a 2022-es és a 2001-es adat között.">
                    ${diff.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span><br/>
                    
                <span class="badge text-bg-secondary" title="2001-es adat: ${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}">
                    ${proptional[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>&nbsp;
                <span class="badge text-bg-secondary" title="2011-es adat.: ${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}">
                    ${proptional[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>&nbsp;
                <span class="badge text-bg-light" title="Változás 2001 és 2011 között.">
                    ${diff1.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span>
                <span class="badge text-bg-light" title="Változás 2011 és 2022 között.">
                    ${diff2.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span>
                `

        } else {

            var diff = (this.data[2022] - this.data[2001]) / this.data[2001] * 100;
            var diff1 = (this.data[2011] - this.data[2001]) / this.data[2001] * 100;
            var diff2 = (this.data[2022] - this.data[2011]) / this.data[2011] * 100;

            if (diff > 5) var color = "success"
            else if (diff < -5) var color = "danger"
            else var color = "info"

            var markup =
                `<span class="badge text-bg-primary even-larger-badge" title="2022-es adat">
                    ${this.data[2022] ? this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>
                <span class="badge text-bg-${color} even-larger-badge" title="Különbség a 2022-es és a 2001-es adat között: ${(this.data[2022] - this.data[2001]).toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${diff.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span><br/>
                    
                <span class="badge text-bg-secondary" title="2001-es adat">
                    ${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>&nbsp;
                <span class="badge text-bg-secondary" title="2011-es adat">
                    ${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>&nbsp;
                <span class="badge text-bg-light" title="Változás 2001 és 2011 között: ${(this.data[2011] - this.data[2001]).toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${diff1.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>
                <span class="badge text-bg-light" title="Változás 2011 és 2022 között: ${(this.data[2022] - this.data[2011]).toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${diff2.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>
                `
        }
        return markup
    }
}

Markup.addMarkup("data", DataMarkup)