export function generate(fullData, colls) {
    console.log("Calc4")
    colls.push('Y15-64');
    $.each(fullData, function (key, value) {
        console.log(value.data);
        fullData[key]['data']['Y15-64'] = {
            '2001': value.data['FY15-64'][2001] + value.data['FY15-64'][2001],
            '2011': value.data['FY15-64'][2011] + value.data['FY15-64'][2011],
            '2022': value.data['FY15-64'][2022] + value.data['FY15-64'][2022],
        };

    });
    console.log(fullData);
    return [fullData, colls];
};