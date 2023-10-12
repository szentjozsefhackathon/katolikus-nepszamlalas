class Markup {
    constructor(data, type, row, settings, orderSelect="selectOrder1") {
        if(this.constructor == Markup) throw "Markup class is abstract"
        this.data = data
        this.type = type
        this.row = row
        this.settings = settings
        this.orderSelect = orderSelect
    }
    static markups = {}
    static addMarkup(markupName, markupClass) {
        if (this.markups[markupName]) throw `Markup with name '${markupName}' are already registered`
        if (!(markupClass.prototype instanceof Markup)) throw `${markupName} is not Markup`
        this.markups[markupName] = markupClass
    }

    static getMarkup(markupName) {
        if(this.markups[markupName]) return this.markups[markupName]
        throw `There is no registered markup with name '${markupName}'`
    }

    static callMarkup(data, type, row, settings) {
        if (!settings["markup"]) {
            settings["markup"] = "data"
        }

        var markupName = typeof(settings["markup"]) == "string" ? settings["markup"] : settings["markup"]["type"]

        if (!this.markups[markupName]) {
            throw `There is no registered markup with name '${markupName}'`
        }

        const markup = new this.markups[markupName](data, type, row, settings)

        return markup.render()
    }

    render() {
        throw "render abstract method has no implementation"
    }

}