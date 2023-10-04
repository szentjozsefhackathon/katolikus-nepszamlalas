export function generate(fullData, colls) {
    console.log("Calc2")
    colls.push('Y_GE65');
    $.each(fullData, function (key, value) {
        console.log(value.data);
        fullData[key]['data']['Y_GE65'] = {
            '2001': value.data['FY_GE65'][2001] + value.data['FY_GE65'][2001],
            '2011': value.data['FY_GE65'][2011] + value.data['FY_GE65'][2011],
            '2022': value.data['FY_GE65'][2022] + value.data['FY_GE65'][2022],
        };

    });
    console.log(fullData);
    return [fullData, colls];

};