export function generate(fullData, colls) {
    console.log("Calc1")
    colls.push('RE_C_NOTRG');
    $.each(fullData, function (key, value) {
        console.log(value.data);
        fullData[key]['data']['RE_C_NOTRG'] = {
            '2001': value.data['RE_C'][2001] - value.data['RE_RC'][2001] - value.data['RE_GC'][2001],
            '2011': value.data['RE_C'][2011] - value.data['RE_RC'][2011] - value.data['RE_GC'][2011],
            '2022': value.data['RE_C'][2022] - value.data['RE_RC'][2022] - value.data['RE_GC'][2022],
        };

    });
    console.log(fullData);
    return [fullData, colls];
};