var g_main_mx1 = [];
var g_main_len = 0;
var g_main_width = 0;
var g_main_slider_cur_idx = 0;
var g_is_popup = false;

function pop_ba_pre_mx1() {
  var width = $(window).width();
  g_main_width = width;
  var pop_list = $('.popup .video__popup--list');
  var tmpl_item = '';
  for (var i=0; i<g_main_mx1.length; i++) {
    var elm_ori = g_main_mx1[i];
    var url_img = elm_ori.data('pop');
    var url_down = elm_ori.data('down')
    if (/\./.test(url_img)) {
      tmpl_item += '<li data-down="' + url_down + '" style="width: ' + width + 'px;"><img src="' + url_img + '" style="width: ' + width + 'px;" alt=""></li>';
    } else {
      var height = width/1.73;
      var ytb = 'https://www.youtube.com/embed/';
      var url = ytb + url_img + '?autoplay=0&enablejsapi=1&version=3';
      var iframe = '<iframe id="jsmx1_video1" type="text/html" width="' + width + 'px" height="' + height + 'px" src="' + url + '" frameborder="0"></iframe>';
      tmpl_item += '<li class="jsmx1_video" style="width: ' + width + 'px;">' + iframe + '</li>';
    }
  }
  pop_list.html(tmpl_item);
  g_is_popup = true;
  $('.popup').css('width', width).addClass('on');
}

function pop_ba_slides_init(num) {
  var elm_wrap = $('#js_list_wrap');
  var elm_list = $('.popup .video__popup--list');
  var elm_prev = $('.popup .popup__left');
  var elm_next = $('.popup .popup__right');
  var elm_last = elm_list.find('li').eq(num - 1).clone();
  var elm_first = elm_list.find('li').eq(0).clone();

  g_main_len = num;

  elm_list.find('li').each(function(i, v) {
    $(v).data('idx', i);
  });

  elm_wrap.width(g_main_width);
  elm_wrap.height(g_main_width/1.73);
  elm_list.prepend(elm_last);
  elm_list.append(elm_first);
  elm_list.width(g_main_width * (num + 2));
}

function pop_ba_sliders_pos(idx) {
  var elm_list = $('.popup .video__popup--list');
  var pos = -1 * g_main_width * (idx + 1)

  g_main_slider_cur_idx = idx;
  elm_list.css('left', pos);

  var elm_down = $('.popup .popup__download');
  var elm_video;
  var elm_img;
  elm_list.find('> li').each(function(i, v) {
    if ($(v).find('iframe').length) {
      elm_video = $(v);
    }
    if ($(v).data('idx') == idx) {
      elm_img = $(v);
    }
  });
  if (elm_video && elm_video.data('idx') == idx) {
    elm_down.hide();
  } else {
    elm_down.show();
  }
  if (elm_img) {
    var url_down = elm_img.data('down');
    elm_down.attr('href', url_down);
  }
}

function pop_ba_sliders_pointer(p) {
  g_main_slider_cur_idx = p;
  if (p < 0) {
    g_main_slider_cur_idx = g_main_len - 1;
  }
  if (p >= g_main_len) {
    g_main_slider_cur_idx = 0;
  }
  pop_ba_sliders_pos(g_main_slider_cur_idx);
};

function pop_ba_sliders_animate(p) {
  var elm_list = $('.popup .video__popup--list');
  var pos = (-1) * (p + 1) * g_main_width;

  elm_list.stop().animate({
    left: pos
  }, 500, function() {
    pop_ba_sliders_pointer(p);
  });
}

function pop_ba_main(idx) {
  g_main_slider_cur_idx = idx;
  pop_ba_pre_mx1();
  pop_ba_slides_init(g_main_mx1.length);
  pop_ba_sliders_pos(idx);
}

function pop_ba_sliders_video_close() {
  var elm_video = $('#jsmx1_video1');
  if (elm_video && elm_video[0]) {
    elm_video[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  }
}

jQuery(function() {
  $('.video__list .pop').each(function(i, v) {
    g_main_mx1.push($(v));
    $(v).data('idx', i);
    $(v).click(function(e) {
      e.preventDefault();
      var idx = $(this).data('idx');
      pop_ba_main(idx);
    });
  });
  $('.popup .popup--download__close').click(function() {
    $('.popup').removeClass('on');
    g_is_popup = false;
  });
  $('.popup .popup__left').click(function() {
    pop_ba_sliders_animate(g_main_slider_cur_idx - 1);
    $(this).blur();
    pop_ba_sliders_video_close();
  });
  $('.popup .popup__right').click(function() {
    pop_ba_sliders_animate(g_main_slider_cur_idx + 1);
    $(this).blur();
    pop_ba_sliders_video_close();
  });
  $(window).resize(function() {
    if (!g_is_popup) return;
    var elm_wrap = $('#js_list_wrap');
    var elm_pop = $('.popup');
    var elm_list = $('.popup .video__popup--list');
    var width = $(window).width();
    elm_pop.css('width', width);
    elm_list.width(width * (g_main_len + 2));
    elm_list.find('> li').width(width);
    elm_list.find('> li > img').width(width);
    elm_list.find('> li > iframe').css({
      'height': width/1.73,
      'width': width
    });
    elm_wrap.width(width);
    elm_wrap.height(width/1.73);
    g_main_width = width;
    pop_ba_sliders_pos(g_main_slider_cur_idx);
  });
});