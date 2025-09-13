const start = 0;
const end = 0;
const new_start = 0;
const bearer_type = 0;

const anims = [];
for (const e of ChartUtils.getAllAnimations()) {
    if (e.bearer_type === bearer_type && e.startTime.value >= start && e.endTime.value <= end) {
        const newe = e.deepcopy();
        newe.startTime = (newe.startTime.value + (new_start - start)).tobeat;
        newe.endTime = (newe.endTime.value + (new_start - start)).tobeat;
        const bearer = ChartUtils.objFromBearerData(newe);
        bearer.animations.push(newe);
        bearer.animations.sortbykey(x => x.startTime.value);
    }
}

onchartchanged("复制事件");
