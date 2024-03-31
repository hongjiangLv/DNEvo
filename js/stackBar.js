const stackWidth = document.querySelector("#stackBar").offsetWidth;
const stackHeight = document.querySelector("#stackBar").offsetHeight;
const stackMargin = {
    top:20,
    right:20,
    bottom:20,
    left:20
};
const stackClipWidth = stackWidth - stackMargin.left - stackMargin.right;
const stackClipHeight = stackHeight - stackMargin.top - stackMargin.bottom;
const stackHypotenuse = Math.sqrt(Math.min(stackClipWidth, stackClipHeight) ** 2);
const stackSvg = d3.select("#stackBar_svg")
    .attr("width", stackWidth)
    .attr("height", stackHeight);

const stack_g = stackSvg.append("g")
    .attr("transform", `translate(${stackClipWidth / 2 + stackMargin.left}, ${stackClipHeight / 2 + stackMargin.top})`);

const stackRScale = d3.scaleRadial()
    .range([stackInnerR, stackHypotenuse / 2])

function drawStackBar(data) {
    data = data.map(d => d["pos"].filter(di => di["index"] <= endIndex && di["index"] >= startIndex)).flat()
    data = d3.group(data, d => d["index"], d => d["angle"])
    let dataNew = []
    data.forEach((v1, k1) =>{
        v1.forEach((v2, k2) =>{
            dataNew.push({
                "index" : k1,
                "angle" : k2,
                "move" : d3.sum(v2, d => d["move"])
            })
        })
    })
    const series = d3.stack()
        .keys(d3.union(dataNew.map(d => d["index"]))) // distinct series keys, in input order
        .value(([, D], key) => D.has(key) ? D.get(key)["move"] : 0) // get value for each series key and stack
        (d3.index(dataNew, d => d["angle"], d => d["index"])); // group by stack then series key
    stackRScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);
    const arc = d3.arc()
        .innerRadius(d => stackRScale(d[0]))
        .outerRadius(d => stackRScale(d[1]))
        .startAngle(d=>(dataAngleToArcAngle(d.data[0]) - 22.5)/180 * Math.PI)
        .endAngle(d=>(dataAngleToArcAngle(d.data[0]) + 22.5)/180*Math.PI)
        .padAngle(0.2)
        .padRadius(stackInnerR);
    const stack = stack_g.selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => scatterColorScale(d.key))
        .selectAll("path")
        .data(D => D.map(d => (d.key = D.key, d)))
        .join("path")
        .attr("d", arc)
    stack_g.append("circle")
        .attr("r", stackInnerR)
        .attr("fill", "none")
        .attr("stroke", scatterColorScale(startIndex))
        .attr("stroke-width", 3)
        .attr("stroke-opacity", 0.6)
}

function dataAngleToArcAngle(angle){
    return angle > 90 ? 360-(angle-90) : Math.abs(angle - 90)
}