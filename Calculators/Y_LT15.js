export function generate(fullData, colls) {
    console.log("Calc3")
    colls.push('Y_LT15');
    $.each(fullData, function (key, value) {
        console.log(value.data);
        fullData[key]['data']['Y_LT15'] = {
            '2001': value.data['FY_LT15'][2001] + value.data['FY_LT15'][2001],
            '2011': value.data['FY_LT15'][2011] + value.data['FY_LT15'][2011],
            '2022': value.data['FY_LT15'][2022] + value.data['FY_LT15'][2022],
        };

    });
    console.log(fullData);
    return [fullData, colls];
};