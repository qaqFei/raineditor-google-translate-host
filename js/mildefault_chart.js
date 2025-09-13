window.defaultChart = {
    fmt: 2,
    meta: {
        background_dim: 0.6,
        name: "Name",
        background_artist: "BgArtist",
        music_artist: "MusArtist",
        charter: "Charter",
        difficulty_name: "Cloudburst",
        difficulty: 0,
        offset: 0.0,
    },
    bpms: [
        {
            time: [0, 0, 1],
            bpm: 120
        }
    ],
    lines: [],
    storyboards: []
};

window.newDefaultSpeedEvent = (eidx, bearer) => {
    return {
        startTime: [0, 0, 1],
        endTime: [0, 1, 4],
        type: 5, // FlowSpeed
        start: 8,
        end: 8,
        index: eidx,
        bearer_type: 0,
        bearer: bearer,
        ease: {
            type: 0,
            press: 0,
            isValueExp: false,
            cusValueExp: "",
            clipLeft: 0.0,
            clipRight: 1.0
        }
    };
};

{
    let eidx = 0;
    for (let i = 0; i < 24; i++) {
        defaultChart.lines.push({
            notes: [],
            animations: [newDefaultSpeedEvent(eidx++, i)],
            index: i
        });
    }
}
