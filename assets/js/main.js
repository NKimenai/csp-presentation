TweenMax.to(".sass-logo", 1.5, {
    x:900,
    rotation:-360,
    
});
TweenMax.to(".sass-logo", 1.5, {
    x:0,
    rotation:360,
    delay:1,    
});

TweenMax.from(".gsap-body", 2, {
    opactiy:0,
    scale:0.5
})