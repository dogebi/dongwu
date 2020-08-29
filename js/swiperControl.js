var swiper = new Swiper('.news__container', {
    loop: true,
    navigation: {
        nextEl: '.news__next',
        prevEl: '.news__prev',
    }
});
$('.news__prev').click(function () {
    var length = $('.swiper-slide').length - 2;
    if (swiper.previousIndex == 1) {
        swiper.slideTo(length, 1000)
    }
})
$('.news__next').click(function () {
    var length = $('.swiper-slide').length - 2;
    if (swiper.previousIndex == length) {
        swiper.slideTo(1, 1000)
    }
})