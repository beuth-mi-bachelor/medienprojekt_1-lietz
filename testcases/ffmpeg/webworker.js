importScripts('../../videochop/js/lib/ffmpeg.js');

function print(text) {
    postMessage({
        'type' : 'stdout',
        'data' : text
    });
}

onmessage = function(event) {
    var module = {
        files: event.data.files || [],
        arguments: event.data.arguments || [],
        print: print,
        printErr: print,
        TOTAL_MEMORY: 268435456
    };
    postMessage({
        'type' : 'start',
        'data' : module.arguments
    });
    var result = ffmpeg_run(module);
    postMessage({
        'type' : 'done',
        'data' : result
    });
};

postMessage({
    'type' : 'ready'
});