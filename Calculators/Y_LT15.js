export function generate(fullData, colls) {
    colls.push('Y_LT15');
    $.each(fullData, function (key, value) {
        fullData[key]['data']['Y_LT15'] = {
            '2001': value.data['FY_LT15'][2001] + value.data['FY_LT15'][2001],
            '2011': value.data['FY_LT15'][2011] + value.data['FY_LT15'][2011],
            '2022': value.data['FY_LT15'][2022] + value.data['FY_LT15'][2022],
        };

    });
    return [fullData, colls];
};