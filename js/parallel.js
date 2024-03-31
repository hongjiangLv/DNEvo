const parallelWidth = document.querySelector("#parallel").offsetWidth;
const parallelHeight = document.querySelector("#parallel").offsetHeight;
const parallelMargin = {
    top:10,
    right:20,
    bottom:25,
    left:10
};

const parallelClipWidth = parallelWidth-parallelMargin.left-parallelMargin.right;
const parallelClipHeight = parallelHeight - parallelMargin.top - parallelMargin.bottom;

const parallelSvg = d3.select("#parallel_svg")
    .attr("width", parallelWidth)
    .attr("height", parallelHeight);

const parallel_g = parallelSvg.append("g")
    .attr("transform", `translate(${parallelMargin.left}, ${parallelMargin.top})`);

let parallel_path;
const parallelKey = ["label", "register_amt",
    // "scope_ind", "employee_number",
    "sme_flag",
    "encouraged_flag", "nation_important_flag", "high_tech_flag", "penalty", "overdue_times"];
let parallelYScale = d3.scaleLinear()
    .domain([0, parallelKey.length - 1])
    .range([parallelMargin.top, parallelClipHeight]);
let parallelXScale = null;
const parallelColorScale = d3.scaleOrdinal().range(d3.schemeCategory10);


function drawParallel(data) {
    parallelXScale = new Map(Array.from(parallelKey, key => [key, d3.scaleLinear()
        .domain(d3.extent(data, d => d[key])).range([parallelMargin.left, parallelClipWidth])]));
    
    const line = d3.line()
        .defined(([, value]) => value != null)
        .x(([key, value]) => parallelXScale.get(key)(value))
        .y(([key]) => parallelYScale(parallelKey.indexOf(key)));
    parallel_path = parallel_g.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.4)
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("class", "parallel_line")
        .attr("id", d => `parallel_line_${d["index"]}`)
        .attr("stroke", d => parallelColorScale(d["label"]))
        .attr("d", d => {
            return line(d3.cross(parallelKey, [d], (key, d) => [key, d[key]]));
        });
    
    //绘制 X 轴
    const axes = parallel_g.append("g")
        .selectAll("g")
        .data(parallelKey)
        .join("g")
        .attr("transform", d => `translate(0,${parallelYScale(parallelKey.indexOf(d))})`)
        .each(function (d, i) {
            d3.select(this).call(d3.axisBottom(parallelXScale.get(d)).ticks(i === 1 ? 3 : 5));
        })
        .call(g => g.append("text")
            .attr("x", parallelMargin.left / 2)
            .attr("y", -6)
            .attr("text-anchor", "start")
            .attr("fill", "black")
            .style("font-size", "14px")
            .text(d => d))
        .call(g => g.selectAll("text")
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke", "white"));
    
    // brush
    const brushHeight = 50;
    const brush = d3.brushX()
        .extent([
            [parallelMargin.left, -(brushHeight / 2)],
            [parallelClipWidth + parallelMargin.left, brushHeight / 2]
        ])
        .on("start brush end.1", parallelBrushed);
    // .on("end.2", updateRingNodes);
    
    axes.call(brush);
    
    const selections = new Map();
    
    function parallelBrushed({selection}, key) {
        if (selection === null) selections.delete(key);
        else selections.set(key, selection.map(parallelXScale.get(key).invert));
        parallel_path.each(function (d) {
            const active = Array.from(selections).every(([key, [min, max]]) => d[key] >= min && d[key] <= max);
            if (active) {
                d3.select(this).raise();
                d3.select(this)
                    .style("stroke", parallelColorScale(d["label"]))
                    .attr("stroke-width", 1.5)
                    .attr("stroke-opacity", 0.6);
                d["parallelTag"] = true;
                selected.push(d);
            } else {
                d3.select(this)
                    .style("stroke", deselectedColor)
                    .attr("stroke-width", 1.5)
                    .attr("stroke-opacity", deselectedOpacity);
                d["parallelTag"] = false;
            }
        });
        ringShow();
    }
}

function reDrawParallel(){
    parallel_path.each(function (d) {
        if (d["parallelTag"]) {
            d3.select(this)
                .style("stroke", parallelColorScale(d["label"]))
                .attr("stroke-width", 1.5)
                .attr("stroke-opacity", 0.8);
        } else {
            d3.select(this)
                .style("stroke", deselectedColor)
                .attr("stroke-width", 0.1)
                .attr("stroke-opacity", deselectedOpacity);
        }
    });
}