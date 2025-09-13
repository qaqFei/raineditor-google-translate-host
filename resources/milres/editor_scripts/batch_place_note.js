const cfg = { // 配置
    num: 10, // 放置多少个 note
    spwan: i => { // i 为放置的第几个 note
        return {
            track_id: 0, // 轨道id
            note: {
                time: [0, 0, 1], // 开始时间
                type: MIL_CES.EnumNoteType.Hit, // note 类型
                isFake: false, // 是否为假 note
                isAlwaysPerfect: false, // 是否总为 perfect
                endTime: [0, 0, 1], // 结束时间
            },
        };
    },
};

const cfg_ease_place = { // 需求不复杂的可以用这个, 记得换变量
    num: 10,
    tracks: [], // 循环放置
    startTime: 0, // 开始时间
    endTime: 1, // 结束时间
    holdTimeStart: 0, // hold开始的持续时间
    holdTimeEnd: 0, // hold结束的持续时间
    type: MIL_CES.EnumNoteType.Hit, // note 类型
    isFake: false, // 是否为假 note
    isAlwaysPerfect: false, // 是否总为 perfect

    spwan: function(i) {
        const track_id = this.tracks[i % this.tracks.length];
        const time = this.startTime + (this.endTime - this.startTime) * i / (this.num - 1);
        const holdTime = this.holdTimeStart + (this.holdTimeEnd - this.holdTimeStart) * i / (this.num - 1);
        const endTime = time + holdTime;
        return {
            track_id: track_id,
            note: {
                time: time.tobeat,
                type: this.type,
                isFake: this.isFake,
                isAlwaysPerfect: this.isAlwaysPerfect,
                endTime: endTime.tobeat,
            },
        };
    }
};

const changed_lines = new Set();

for (let i = 0; i < cfg.num; i++) {
    const note = cfg.spwan(i);
    const line = ChartUtils.lineFromIdx(note.track_id);
    note.note.index = ChartUtils.nextNoteIdx();
    line.notes.push(Utils.filterKeys(note.note, [
        "time", "type", "isFake", "isAlwaysPerfect", "endTime",
        "index"
    ]));
    changed_lines.add(line);
}

changed_lines.forEach(line => {
    line.notes.sortbykey(n => n.time.value);
});

onchartchanged("batch_place_note");
