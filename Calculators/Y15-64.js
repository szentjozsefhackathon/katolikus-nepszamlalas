export function generate(fullData, colls) {
    colls.push('Y15-64');
    $.each(fullData, function (key, value) {
        fullData[key]['data']['Y15-64'] = {
            '2001': value.data['FY15-64'][2001] + value.data['FY15-64'][2001],
            '2011': value.data['FY15-64'][2011] + value.data['FY15-64'][2011],
            '2022': value.data['FY15-64'][2022] + value.data['FY15-64'][2022],
        };

    });
    return [fullData, colls];
};