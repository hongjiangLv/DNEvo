let data;

let startIndex = 1;
let endIndex = 35;
const innerR = 3;
const outerR = 10;

// 平行坐标轴中被过滤掉的边的颜色
const deselectedColor = "#ddd";
const deselectedOpacity = 0.2;

// 记录被选中的节点, 平行坐标轴
const selected = [];

//stackBar 内环半径
const stackInnerR = 10;
// 主视图 brush刷中的数据
let brushData = null;

// 力导向图对象的网络数据
let forceNodesId = [];
let forceNodes = [];
let forceEdges = [];
let forceNodeSize = 5;

// 节点属性雷达图
const nodeAttrValues = ["register_amt", "penalty", "graphNum"];
const nodeAttrPercent = ["sme_flag", "encouraged_flag", "high_tech_flag", "nation_important_flag"];

let currentGraphTag = "degree_out";
let currentNodeTag = "company";

// 需要调整的数值
const totalMoveMax = 13;
const graphNumMax = 36;

let totalMoveSelectMin = 0;
let totalMoveSelectMax = totalMoveMax;

let graphNumSelectMin = 0;
let graphNumSelectMax = graphNumMax;
// 主图每个图元的内径和外径大小
const scatterInnerR = 2;
const scatterOuterR = 15;

// tSNE 多视图的联动
let tsneSelectNodeId = [];

let forceCenterColor = '#2f4554';

//雷达图
let indicatorRadar = {
    "company": [
        { name: 'register_amt', max: 1 },
        { name: 'penalty', max: 1 },
        // { name: 'employee', max: 1 },
        { name: 'graphNum', max: 1 },
        { name: 'sme', max: 1},
        { name: 'encouraged', max: 1 },
        { name: 'high_tech', max: 1 },
        { name: 'nation_important', max: 1 }
    ],
    "risk": [
        { name: 'original_stress', max: 1 },
        { name: 'additional_stress', max: 1 },
        { name: 'original_losses', max: 1 },
        { name: 'additional_losses', max: 1 },
        { name: 'impd', max: 1 },
        { name: 'imps', max: 1 },
    ]
}

let radarRiskList = indicatorRadar["risk"].map(iR => iR["name"])
let radarValue = {
    "company": {
        "avg": [],
        "select": []
    },
    "risk": {
        "avg": [],
        "select": []
    },
}