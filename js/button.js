let isInfo = false;
d3.select("#info")
    .on("click", function (event, d) {
        if (!isInfo) {
            isInfo = true;
            d3.select(this).style("background-color", "#d4d4d4");
            scatter_g.selectAll("g")
                .on("mouseover", function (event, d) {
                    d3.select("#tooltip")
                        .style("display", "block")
                        .style("z-index", 10000)
                        .style("transform", `translate(${event.x - document.querySelector("#left").offsetWidth}px, ${event.y}px)`)
                        .html(
                            "ID: " + d["id"] + "<br>" +
                            "register_amt: " + (d["register_amt"] / 10000).toFixed(2) + "万元<br>" +
                            "penalty: " + d["penalty"] + "<br>" +
                            "overdue_times: " + d["overdue_times"] + "<br>" +
                            "encouraged_flag: " + d["encouraged_flag"] + "<br>" +
                            "high_tech_flag: " + d["high_tech_flag"] + "<br>" +
                            "nation_important_flag: " + d["nation_important_flag"] + "<br>" +
                            "totalMove: " + parseFloat(d["totalMove"]).toFixed(2) + "<br>" +
                            "graphNum: " + d["graphNum"]
                        );
                })
                .on("mouseout", function () {
                    d3.select("#tooltip")
                        .style("display", "none")
                        .style("z-index", -10);
                });
        } else {
            isInfo = false;
            d3.select(this).style("background-color", "#f6f5ee");
            scatter_g.selectAll("g")
                .on("mouseover", null)
                .on("mouseout", null);
        }
    })
    .on("mouseover", function () {
        this.title = "show information";
    });

let showPath = false;

d3.select("#path")
    .on("click", function (event, d) {
        if (!showPath) {
            showPath = true;
            d3.select(this).style("background-color", "#d4d4d4");
            scatter_g.selectAll("g")
                .on("click.path", function (event, datum) {
                    if (datum.showPos) {
                        posLine_g.select(`#line_${datum["index"]}`).remove();
                        datum.showPos = false;
                    } else {
                        datum.showPos = true;
                        
                        posLine_g.append("g")
                            .attr("class", "line")
                            .attr("id", `line_${datum["index"]}`)
                            // .selectAll("path")
                            // .data(gpl(datum["pos"]))
                            // .join("path")
                            .append("path")
                            .attr("d", posLineMaker(datum["pos"]))
                            .attr("fill", "none")
                            .attr("stroke", "#000000")
                            .attr("marker-end", "url(#arrowhead)")
                            .attr("stroke-width", 1)
                            .attr("stroke-opacity", 0.8);
                        
                        function gpl(d) {
                            let posLineTmp = [];
                            d.reduce((pre, cur) => {
                                posLineTmp.push([pre, cur]);
                                return cur;
                            });
                            return posLineTmp;
                        }
                    }
                });
        } else {
            showPath = false;
            d3.select(this).style("background-color", "#f6f5ee");
            scatter_g.selectAll("g")
                .on("click.path", null);
            posLine_g.selectAll(".line").remove();
        }
    })
    .on("mouseover", function () {
        this.title = "show detail trajectory";
    });

let showBar = false;

d3.select("#bar")
    .on("click", function (event, d) {
        if (!showBar) {
            showBar = true;
            d3.select(this).style("background-color", "#d4d4d4");
            scatter_g.selectAll("g")
                .on("click.bar", function (event, datum) {
                    drawGraphStatic([datum], currentGraphTag, 1);
                    graphSelectEl.addEventListener("change", function () {
                        currentGraphTag = this.value;
                        drawGraphStatic([datum], currentGraphTag, 1);
                    });
                });
        } else {
            showBar = false;
            d3.select(this).style("background-color", "#f6f5ee");
            scatter_g.selectAll("g")
                .on("click.bar", null);
            graphCover();
        }
    })
    .on("mouseover", function () {
        this.title = "show graph info with click";
    });

let showForce = false;
d3.select("#force")
    .on("click", function (event) {
        if (!showForce) {
            showForce = true;
            d3.select(this).style("background-color", "#d4d4d4");
            scatter_g.selectAll("g")
                .on("click.force", function (event, d) {
                    if (d["graphNum"] > 0) {
                        d["pos"].forEach(pos => {
                            if (pos.edge === 0) {
                                d3.select(`#f${pos["index"]}`)
                                    .style("display", "none");
                            } else {
                                d3.select(`#f${pos["index"]}`)
                                    .style("display", "block");
                                forceEdges = _.cloneDeep(pos["edge"]);
                                forceNodesId.length = 0;
                                forceNodes.length = 0;
                                forceEdges.forEach(e => {
                                    forceNodesId.push(e["source"]);
                                    forceNodesId.push(e["target"]);
                                });
                                forceNodesId = [...new Set(forceNodesId)];
                                forceNodesId.forEach(i => forceNodes.push(data[i]));
                                forceEdges.forEach(e => {
                                    e["source"] = forceNodesId.indexOf(e["source"]);
                                    e["target"] = forceNodesId.indexOf(e["target"]);
                                });
                                let svg = d3.select(`#fg${pos["index"]}`);
                                svg.selectAll("g").remove();
                                svg.selectAll("defs").remove();
                                let g = svg.append("g");
                                drawForceGraph(svg, g, forceNodes, forceEdges, forceWidth, forceHeight, [d]);
                            }
                        });
                    } else {
                        alert("This node no graph, please select others");
                    }
                });
        } else {
            showForce = false;
            d3.select(this).style("background-color", "#f6f5ee");
            scatter_g.selectAll("g")
                .on("click.force", null);
        }
    })
    .on("mouseover", function () {
        this.title = "show force graph";
    });

let isBrush = false;
d3.select("#brush")
    .on("click", function (event, d) {
        if (!isBrush) {
            isBrush = true;
            d3.select(this).style("background-color", "#d4d4d4");
            scatterBrush_g.call(scatterBrush);
        } else {
            isBrush = false;
            d3.select(this).style("background-color", "#f6f5ee");
            scatterBrush_g.selectAll("*").remove();
            graphCover();
        }
    })
    .on("mouseover", function () {
        this.title = "brush";
    });


let scatterBrush = d3.brush()
    .on("end", brushed);

function brushed(event) {
    let s = event.selection;
    if (!event.sourceEvent) return;
    if (!s) {
        posLine_g.selectAll(".line").remove();
        rings_g.each(d => {
            d["parallelTag"] = true;
        });
        reDrawParallel();
        drawStackBar(data);
        redrawNodeAttr(null);
        // drawGraphStatic(data, currentGraphTag);
        graphCover();
        drawTSNEGraph(data);
    } else {
        // scatterBrush_g.select(".brush").call(scatterBrush.move, null);
        // 刷选与平行坐标轴，方向堆叠柱状图联动 这两个不需要判断，默认触发；
        rings_g.each(d => {
            d["parallelTag"] = d["parallelTag"] && d["x"] + scatterMargin.left >= s[0][0] && d["x"] + scatterMargin.left <= s[1][0] && d["y"] + scatterMargin.top >= s[0][1] && d["y"] + scatterMargin.top <= s[1][1];
        });
        reDrawParallel();
        brushData = data.filter(d => {
            return d["x"] + scatterMargin.left >= s[0][0] && d["x"] + scatterMargin.left <= s[1][0] &&
                d["y"] + scatterMargin.top >= s[0][1] && d["y"] + scatterMargin.top <= s[1][1] &&
                d["parallelTag"] &&
                d["totalMove"] >= totalMoveSelectMin && d["totalMove"] <= totalMoveSelectMax &&
                d["graphNum"] >= graphNumSelectMin && d["graphNum"] <= graphNumSelectMax;
        });
        
        drawStackBar(brushData);
        //刷选在雷达图中增加
        redrawNodeAttr(brushData);
        //graph
        drawGraphStatic(brushData, currentGraphTag, 1);
        graphSelectEl.addEventListener("change", function () {
            currentGraphTag = this.value;
            drawGraphStatic(brushData, currentGraphTag, 1);
        });
        
        //tsne
        drawTSNEGraph(brushData);
        
        // 刷选条件下是否展示轨迹，取决于轨迹按钮是否被选中
        if (showPath) {
            posLine_g.selectAll("g")
                .data(brushData)
                .join("g")
                .attr("class", "line")
                .attr("id", d => `line_${d["index"]}`)
                .append("path")
                .attr("d", d => posLineMaker(d["pos"]))
                .attr("fill", "none")
                .attr("stroke", "#000000")
                .attr("marker-end", "url(#arrowhead)")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0.8);
        }
        // 刷选条件下是否展示力导向图，取决力导向按钮是否被选中
        if (showForce) {
            drawGraphFormData(brushData);
        }
    }
}

//右下切换图形统计视图
let graphSelectEl = document.getElementById("graphSelect");
graphSelectEl.addEventListener("change", function () {
    currentGraphTag = this.value;
    drawGraphStatic(data, currentGraphTag,0);
});

let nodeSelectEl = document.getElementById("radarSelect");
nodeSelectEl.addEventListener("change", function () {
    currentNodeTag = this.value;
    selectNodeAttr(currentNodeTag);
})

function graphCover() {
    drawGraphStatic(data, currentGraphTag, 0);
    graphSelectEl.addEventListener("change", function () {
        currentGraphTag = this.value;
        drawGraphStatic(data, currentGraphTag, 0);
    });
}


let isHighLight = false;

d3.select("#highlight")
    .on("click", function (event, d) {
        if (!isHighLight) {
            isHighLight = true;
            d3.select(this).style("background-color", "#d4d4d4");
            highlight_g.attr("fill-opacity", d => d["overdue_times"] > 0 ? 0.3 : 0);
        } else {
            isHighLight = false;
            d3.select(this).style("background-color", "#f6f5ee");
            highlight_g.attr("fill-opacity", d => 0);
        }
    })
    .on("mouseover", function () {
        this.title = "highlight the overdue company";
    });