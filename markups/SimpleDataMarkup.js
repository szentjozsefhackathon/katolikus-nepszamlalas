class SimpleDataMarkup extends Markup {
    render() {
        if (!this.data) return '<span class="alert alert-danger">' + this.settings['data'] + ' is missing!</span>';

        // A dataTable sorrendiségéhez szükséges. Nem lehetne innen kiszervezni?
        if (this.settings == "sort" || this.settings == 'type') {
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
                proptional[year] = this.data[year] / this.row[this.settings['inProprotionTo']][year] * 100;
            });


            var markup =
                `<span class="badge text-bg-primary even-larger-badge" title="${this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })} (2022-es adat)">
                    ${proptional[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span><br/>
                <span class="badge text-bg-secondary" title="${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"} (2001-es adat)">
                    ${proptional[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>&nbsp;
                <span class="badge text-bg-secondary" title="${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"} (2011-es adat)">
                    ${proptional[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%
                </span>&nbsp;`

        } else {
            var markup = `<span class="badge text-bg-primary even-larger-badge" title="2022-es adat">
                    ${this.data[2022] ? this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span><br/>		
                <span class="badge text-bg-secondary" title="2001-es adat">
                    ${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>&nbsp;
                <span class="badge text-bg-secondary" title="2011-es adat">
                    ${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}
                </span>&nbsp;`
        }
        return markup
    }
}

Markup.addMarkup("simpleData", SimpleDataMarkup)