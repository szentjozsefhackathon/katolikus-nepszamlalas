class DataMarkup extends SimpleDataMarkup {

    render() {
        if (!this.data) return '<i>Hiányzó adat.</i>'; // <span class="alert alert-danger">' + this.settings['data'] + ' is missing!</span>';
        this.calculate()
        if (this.sortTable()) return this.sortTable()

        const OS = document.getElementById(this.orderSelect).value;
        if (this.settings['inProprotionTo']) {
            if (!this.row[this.settings['inProprotionTo']]) {
                return '<i>Hiányzó adat.</i>'; // '<span class="alert alert-danger">' + this.settings['inProprotionTo'] + ' is missing!</span>';
            }
            if (this.diff["20012022"] > 5) var color = "success"
            else if (this.diff["20012022"] < -5) var color = "danger"
            else var color = "info"

            var markup =
                `<span ${isNaN(this.proptional[2022])?'style="display: none" ':''}class="badge text-bg-primary even-larger-badge ${OS=='2022data'? "highlight-data": ''} title="2022-es adat: ${this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${this.proptional[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>
                <span ${isNaN(this.diff["20012022"])?'style="display: none" ':''}class="badge text-bg-${color} even-larger-badge  ${OS=='diff20012022'? "highlight-data": ''}" title="Különbség a 2022-es és a 2001-es adat között.">
                    ${this.diff["20012022"].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span><br/>
                    
                <span ${isNaN(this.proptional[2001])?'style="display: none" ':''}class="badge text-bg-secondary ${OS=='2001data'? "highlight-data": ''}" title="2001-es adat: ${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}">
                    ${this.proptional[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>&nbsp;
                <span ${isNaN(this.proptional[2011])?'style="display: none" ':''}class="badge text-bg-secondary  ${OS=='2011data'? "highlight-data": ''}" title="2011-es adat.: ${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}">
                    ${this.proptional[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>&nbsp;
                <span ${isNaN(this.diff["20012011"])?'style="display: none" ':''}class="badge text-bg-light ${OS=='diff20012011'? "highlight-data": ''}" title="Változás 2001 és 2011 között.">
                    ${this.diff["20012011"].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span>
                <span ${isNaN(this.diff["20112022"])?'style="display: none" ':''}class="badge text-bg-light ${OS=='diff20112022'? "highlight-data": ''}" title="Változás 2011 és 2022 között.">
                    ${this.diff["20112022"].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span>
                `

        } else {
            if (this.diff["20012022"] > 5) var color = "success"
            else if (this.diff["20012022"] < -5) var color = "danger"
            else var color = "info"

            var markup =
                `<span ${isNaN(this.data[2022])?'style="display: none" ':''}class="badge text-bg-primary even-larger-badge  ${OS=='2022data'? "highlight-data": ''}" title="2022-es adat">
                    ${this.data[2022] ? this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>
                <span ${isNaN(this.diff["20012022"])?'style="display: none" ':''}class="badge text-bg-${color} even-larger-badge  ${OS=='diff20012022'? "highlight-data": ''}" title="Különbség a 2022-es és a 2001-es adat között: ${(this.data[2022] - this.data[2001]).toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${this.diff["20012022"].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span><br/>
                    
                <span ${isNaN(this.data[2001])?'style="display: none" ':''}class="badge text-bg-secondary ${OS=='2001data'? "highlight-data": ''}" title="2001-es adat">
                    ${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>&nbsp;
                <span ${isNaN(this.data[2011])?'style="display: none" ':''}class="badge text-bg-secondary  ${OS=='2011data'? "highlight-data": ''}" title="2011-es adat">
                    ${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"}</span>&nbsp;
                <span ${isNaN(this.diff["20012011"])?'style="display: none" ':''}class="badge text-bg-light ${OS=='diff20012011'? "highlight-data": ''}" title="Változás 2001 és 2011 között: ${(this.data[2011] - this.data[2001]).toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${this.diff["20012011"].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>
                <span ${isNaN(this.diff["20112022"])?'style="display: none" ':''}class="badge text-bg-light ${OS=='diff20112022'? "highlight-data": ''}" title="Változás 2011 és 2022 között: ${(this.data[2022] - this.data[2011]).toLocaleString('hu-HU', { maximumFractionDigits: 2 })}">
                    ${this.diff["20112022"].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>
                `
        }
        return markup
    }
}

Markup.addMarkup("data", DataMarkup, "Részletes adat", true, false, false)