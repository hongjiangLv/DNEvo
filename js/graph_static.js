// const graphAttrWidth = document.querySelector("#graphAttr").offsetWidth;
// const graphAttrHeight = document.querySelector("#graphAttr").offsetHeight;
// const graphAttrMargin = {
//     top:20,
//     left:20,
//     bottom:20,
//     right:10,
// }
// const graphAttrClipWidth = graphAttrWidth - graphAttrMargin.left - graphAttrMargin.right;

let graphChartDom = document.getElementById("graphAttrs");
let graphChart = echarts.init(graphChartDom);
let graphAttrOption;

graphAttrOption = {
    xAxis: {
        type: "category",
        data: d3.range(startIndex - 1, endIndex + 1)
    },
    yAxis: {
        type: "value"
    },
    color: [
        "#2f4554", "#d9c113"
    ],
    tooltip: {
        show: true,
        trigger: "axis",
    },
    grid: {
        containLabel: true,
        left: 0,
        top: 10,
        bottom: 25,
        right: 0
    },
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            name: "average",
            itemStyle:{
                opacity:1
            }
        },
        {
            data: [],
            type: "line",
            symbol:"circle",
            name: "selected"
        }
    ]
};

// graphAttrOption && graphChart.setOption(graphAttrOption);
function drawGraphStatic(data, tag, index = 0) {
    let barData = [];
    let tmp = data.map(d => d["pos"]).flat();
    d3.range(startIndex - 1, endIndex + 1).forEach(i => {
        // let t = tmp.filter(t => t["index"] === i & t[tag] !== 0);
        let t = tmp.filter(t => t["index"] === i);
        if (t.length){
            barData.push(d3.mean(t, td => td[tag]).toFixed(2));
        }else {
            barData.push(0);
        }
    });
    graphAttrOption["series"][index]["data"] = barData;
    if (index === 0){
        graphAttrOption["series"][index + 1]["data"] = [];
        graphAttrOption["series"][index]["itemStyle"]["opacity"] = 1;
    }else {
        graphAttrOption["series"][index - 1]["itemStyle"]["opacity"] = 0.3;
    }
    graphAttrOption && graphChart.setOption(graphAttrOption);
}