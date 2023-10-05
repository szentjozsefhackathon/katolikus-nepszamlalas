export function generate(fullData, colls) {
    colls.push('Y_GE65');
    $.each(fullData, function (key, value) {
        fullData[key]['data']['Y_GE65'] = {
            '2001': value.data['FY_GE65'][2001] + value.data['FY_GE65'][2001],
            '2011': value.data['FY_GE65'][2011] + value.data['FY_GE65'][2011],
            '2022': value.data['FY_GE65'][2022] + value.data['FY_GE65'][2022],
        };

    });
    return [fullData, colls];

};