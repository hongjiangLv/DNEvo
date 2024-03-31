let nodeAttrWidth = document.querySelector("#nodeAttr").offsetWidth;
let nodeAttrHeight = document.querySelector("#nodeAttr").offsetHeight;

let nodeAttrDom = document.getElementById("nodeAttrs");
let nodeAttrChart = echarts.init(nodeAttrDom);
let nodeAttrOption;
nodeAttrOption = {
    color: [
        "#2f4554", "#d9c113"
    ],
    grid: {
        left: "10px",
        right: "10px",
        bottom: "10px",
    },
    tooltip: {
        show: true
    },
    radar: {
        // shape: 'circle',
        indicator: indicatorRadar["company"],
    },
    series: [
        {
            name: "select vs avg",
            type: "radar",
            data: [
                {
                    value: [1, 1, 1, 1, 1, 1, 1],
                    name: "Average Value",
                    symbolSize: 0
                },
                {
                    value: [],
                    name: "Select Value",
                    symbolSize: 0
                }
            ]
        }
    ]
};
let radarCompanyMaxValue = [];
let radarRiskMaxValue = [];
function drawNodeAttr(data, tag) {
    // nodeAttrOption["radar"]["indicator"][0]["max"] = d3.mean(data, d => d["register_amt"]/10000) * 2;
    // nodeAttrOption["radar"]["indicator"][1]["max"] = d3.mean(data, d => d["penalty"]/10000) * 2;
    // nodeAttrOption["radar"]["indicator"][2]["max"] = d3.mean(data, d => d["employee_number"]) * 2;
    // nodeAttrOption["radar"]["indicator"][3]["max"] = d3.mean(data, d => d["graphNum"]) * 2;
    // radarCompanyMaxValue.push(d3.mean(data, d => d["register_amt"]/10000) * 2)
    // radarCompanyMaxValue.push(d3.mean(data, d => d["penalty"]/10000) * 2)
    // radarCompanyMaxValue.push(d3.mean(data, d => d["employee_number"]) * 2)
    // radarCompanyMaxValue.push(d3.mean(data, d => d["graphNum"]) * 2)
    // nodeAttrOption["radar"]["indicator"][4]["max"] = data.filter(d => d[nodeAttrPercent[0]] === 1).length/data.length * 2;
    // nodeAttrOption["radar"]["indicator"][5]["max"] = data.filter(d => d[nodeAttrPercent[1]] === 1).length/data.length * 2;
    // nodeAttrOption["radar"]["indicator"][6]["max"] = data.filter(d => d[nodeAttrPercent[2]] === 1).length/data.length * 2;
    
    // company的初始化
    indicatorRadar["company"][0]["max"] = d3.mean(data, d => d["register_amt"] / 10000) * 2;
    indicatorRadar["company"][1]["max"] = d3.mean(data, d => d["penalty"] / 10000) * 2;
    // indicatorRadar["company"][2]["max"] = d3.mean(data, d => d["employee_number"]) * 2;
    indicatorRadar["company"][2]["max"] = d3.mean(data, d => d["graphNum"]) * 2;
    // 记录默认情况下最大值
    radarCompanyMaxValue = indicatorRadar["company"].map(i => i["max"]);
    nodeAttrValues.forEach((n, i) => i < 2 ? radarValue["company"]["avg"].push(d3.mean(data, d => d[n] / 10000))
        : radarValue["company"]["avg"].push(d3.mean(data, d => d[n])));
    nodeAttrPercent.forEach(n => radarValue["company"]["avg"].push(data.filter(d => d[n] === 1).length / data.length));
    
    // risk的初始化
    let tmp = data.map(d => d["pos"]).flat();
    indicatorRadar["risk"].forEach(iR => {
        // let t = tmp.filter(t => t[iR["name"]] !== 0);
        let t = tmp;
        if (t.length) {
            iR["max"] = d3.mean(t, td => td[iR["name"]]).toFixed(2) * 2;
            radarValue["risk"]["avg"].push(parseFloat(d3.mean(t, td => td[iR["name"]]).toFixed(2)));
        } else {
            iR["max"] = 1;
            radarValue["risk"]["avg"].push(1)
        }
    });
    radarRiskMaxValue = indicatorRadar["risk"].map(i => i["max"]);
    nodeAttrOption["radar"]["indicator"] = indicatorRadar[tag];
    nodeAttrOption["series"][0]["data"][0]["value"] = radarValue[tag]["avg"];
    nodeAttrOption && nodeAttrChart.setOption(nodeAttrOption);
}

function redrawNodeAttr(data) {
    if (data) {
        // company
        nodeAttrValues.forEach((n, i) => i < 2 ? radarValue["company"]["select"].push(d3.mean(data, d => d[n] / 10000))
            : radarValue["company"]["select"].push(d3.mean(data, d => d[n])));
        nodeAttrPercent.forEach(n => radarValue["company"]["select"].push(data.filter(d => d[n] === 1).length / data.length));
        // nodeAttrOption["series"][0]["data"][1]["value"] = radarValue["company"]["select"];
        
        let basicValue = radarValue["company"]["avg"];
        for (let i = 0; i < 3; i++) {
            indicatorRadar["company"][i]["max"] = Math.max(basicValue[i], radarValue["company"]["select"][i]) * 1.5;
        }
        // node
        let tmp = data.map(d => d["pos"]).flat();
        indicatorRadar["risk"].forEach(iR => {
            // let t = tmp.filter(t => t[iR["name"]] !== 0);
            let t = tmp;
            if (t.length) {
                iR["max"] = Math.max(iR["max"], parseFloat(d3.mean(t, td => td[iR["name"]]).toFixed(2))) * 1.5;
                radarValue["risk"]["select"].push(parseFloat(d3.mean(t, td => td[iR["name"]]).toFixed(2)));
            } else {
                iR["max"] = 1;
                radarValue["risk"]["select"].push(1)
            }
        });
    } else {
        // nodeAttrOption["series"][0]["data"][1]["value"] = [];
        // for (let i = 0; i < 4; i++) {
        //     nodeAttrOption["radar"]["indicator"][i]["max"] = indicatorRadar["company"][i]["max"];
        // }
        // nodeAttrOption["radar"]["indicator"] = indicatorRadar[currentNodeTag];
        radarValue["company"]["select"] = [];
        radarValue["risk"]["select"] = [];
        indicatorRadar["company"].forEach((iR, index) =>{
            iR["max"] = radarCompanyMaxValue[index]
        });
        indicatorRadar["risk"].forEach((iR, index) =>{
            iR["max"] = radarRiskMaxValue[index]
        });
    }
    nodeAttrOption["radar"]["indicator"] = indicatorRadar[currentNodeTag];
    nodeAttrOption["series"][0]["data"][1]["value"] = radarValue[currentNodeTag]["select"];
    nodeAttrOption && nodeAttrChart.setOption(nodeAttrOption);
}

// 切换不同数据统计
function selectNodeAttr(tag) {
    nodeAttrOption["radar"]["indicator"] = indicatorRadar[tag];
    nodeAttrOption["series"][0]["data"][0]["value"] = radarValue[tag]["avg"];
    nodeAttrOption["series"][0]["data"][1]["value"] = radarValue[tag]["select"];
    nodeAttrOption && nodeAttrChart.setOption(nodeAttrOption);
}

