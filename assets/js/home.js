TweenMax.from('.introduction-header h1',1,{
    y: -300, opacity: 0, scale: 0.5
})

TweenMax.from('.introduction-header h2',0.5,{
    delay:1,
    y:100,
    rotation:90,
    opacity:0
})

var tl = new TimelineMax({repeat:30, repeatDelay:1, yoyo:true});


//add 3 tweens that will play in direct succession.
tl.from("#sass-logo", 2, {
    x:-1000,
    y:600,
    ease:Elastic.easeOut,
    duration:2,
    delay:1.5
});


// TweenMax.from("#sass-logo", 2, {
//     x:-1000,
//     y:600,
//     ease:Elastic.easeOut,
//     duration:2,
//     delay:1.5
// });

TweenMax.from("#gsap-logo", 2, {
    // x:1500,
    y:-700,
    ease:Elastic.easeOut,
    duration:1,
    delay:1.75
});

TweenMax.from("#gulp-logo", 2, {
    x:750,
    y:-300,
    ease:Bounce.easeOut,
    duration:2,
    delay:2
});