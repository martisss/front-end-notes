console.log('1'); // ①同步任务 

setTimeout(function() { // ① 宏任务
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})

process.nextTick(function() { // ① 微任务
    console.log('6');
})

new Promise(function(resolve) {
    console.log('7'); // ① 同步任务 
    resolve();
}).then(function() { // ① 微任务
    console.log('8')
})

setTimeout(function() { // ① 宏任务
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
    
    console.log('13');
    
    process.nextTick(function() {
        console.log('14'); // 微任务 process.nextTick 比 promse.then优先级要高
    })
})
