//common
$(function(){
	if(window.console!=undefined){setTimeout(console.log.bind(console,'%cWe are POSTFIXO%c\nwebsite : postfixo.com\ncontact us : help@postfixo.com','padding:5px;font-size:20px;color:#fff;background:#a200ff','padding:5px;font-size:15px;color:#777;background:#f4f4f4'),0);}

	//ie 스크롤시 fixed 떨림 보정
	/*
	if(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/)) {
		$('body').on("mousewheel", function () {
			event.preventDefault();

			var wheelDelta = event.wheelDelta;

			var currentScrollPosition = window.pageYOffset;
			window.scrollTo(0, currentScrollPosition - wheelDelta);
		});
		$('body').keydown(function (e) {
			//e.preventDefault(); // prevent the default action (scroll / move caret)
			var currentScrollPosition = window.pageYOffset;

			switch (e.which) {

				case 38: // up
					window.scrollTo(0, currentScrollPosition - 120);
					break;

				case 40: // down
					window.scrollTo(0, currentScrollPosition + 120);
					break;

				default: return; // exit this handler for other keys
			} 
		});
	}*/

	resizekeyvisualMain();
	$(window).on('resize', function(){resizekeyvisualMain()});
	function resizekeyvisualMain(){
		if(window.innerWidth > 1279){
			$('#keyvisualMain .slide').height($(window).height() - $('#header').height());
		} else {
			$('#keyvisualMain .slide').height($(window).height());
		}
	}
	$('#keyvisualMain .slide .swiper-slide').each(function(index){
		var index = index+1, 
			url = $(this).find('.box-image img').attr('src');
		$(this).find('.box-image').css('background-image', 'url('+url+')');
		$(this).addClass('item'+index);
	});
	var keyvisualMain = new Swiper('#keyvisualMain .slide',{
		autoplay: { delay: 5000, disableOnInteraction: false },
		speed: 800, 
		loop: true, 
		effect: 'slide', 
		navigation: {
			nextEl: '#keyvisualMain .slide .arrow-next', 
			prevEl: '#keyvisualMain .slide .arrow-prev', 
		}, 
		pagination: {
			el: '#keyvisualMain .slide .pagination', type: 'bullets', clickable: true
		}, 
		on: {
			slideChangeTransitionEnd: function(){
				$('#keyvisualMain .slide .swiper-slide [data-ani]').removeClass('fixo-animate');
				$('#keyvisualMain .slide .swiper-slide.item'+(this.realIndex+1)+' [data-ani]').addClass('fixo-animate');
			}
		}
	});

	// 반응형이미지맵
	$('img[usemap]').rwdImageMaps();

	//animation
	animate();
	$(window).on('scroll resize', function(){
		animate();
	});
	function animate(){
		$('.ani-init').each(function(){
			var aniObj = $(this).offset().top;
			if($(this).data('ani').indexOf('up') > -1){
				aniObj = $(this).offset().top-100;
			} else if($(this).data('ani').indexOf('down') > -1){
				aniObj = $(this).offset().top+100;
			}
			if($(this).hasClass('fixo-animate')){
				aniObj = $(this).offset().top;
			}
            var aniWindow = $(window).scrollTop() + $(window).height()/1.2;
			var aniWindowRemove = $(window).scrollTop() + $(window).height();
            if(aniWindow > aniObj){
                $(this).addClass('fixo-animate');
            } else if(aniWindowRemove < aniObj) {
				//$(this).removeClass('fixo-animate');
			}
		});
	};

	animateArea();
	$(window).on('scroll resize', function(){
		animateArea();
	});
	function animateArea(){
		$('.ani-wrap').each(function(){
			var aniObj = $(this).offset().top;
            var aniWindow = $(window).scrollTop() + $(window).height()/1.2;
			var aniWindowRemove = $(window).scrollTop() + $(window).height();
            if(aniWindow >= aniObj){
                $(this).addClass('fixo-animate-area');
            } else if(aniWindowRemove < aniObj) {
				//$(this).removeClass('fixo-animate-area');
			}
			/*
			if($(window).scrollTop() > aniEnd) {
				$(this).removeClass('animate');
			}*/
		});
	};

	//팝업창
	$('.fixo-popup').each(function(){
		var start = $(this).attr('data-start');
		var end = $(this).attr('data-end');
		var start_date = Date.parse(start);
		var end_date = Date.parse(end);
		var cookie_name = $(this).attr('class').split(' ')[1];
		if(Date.now() >= start_date && Date.now() <= end_date){
			if($.cookie(cookie_name) != 'done'){
				$(this).addClass('active');
				$(this).find('.btn-close').click(function(){
					$(this).closest('.fixo-popup').removeClass('active');
					if($(this).closest('.fixo-popup').find('.btn-check input').is(':checked')){
						$.cookie(cookie_name,'done', {expires: 1});
					}
				});
			}
		}
	});

	// 모바일접속 구분
	var filter = "win16|win32|win64|mac|macintel";
	if (navigator.platform) {
		if (filter.indexOf(navigator.platform.toLowerCase() ) < 0){ //mobile alert('mobile 접속');
			$('.nofixed').each(function(){
				$(this).css({'background-attachment': 'scroll', 'background-size': 'cover'});
			});

			//mobile hide
			$('.displaypc').removeClass('active');
			$('.displaymobile').addClass('active');
		} else { //pc alert('pc 접속');
		}
	}

	//메뉴애니메이션
	var topH;
	setTop();
	$(window).on('resize', function(){
		setTop();
	});
	function setTop(){
		if(window.innerWidth > 1279){
			topH = $('#header .header-top .gnb-wrap').outerHeight();
		} else {
			topH = $('#header').outerHeight();
		}
	}
	$('#header .header-top .btn-gnb').on('click', function(){
		if($('html').hasClass('expand-menu')){
			scrollAble();
		} else {
			scrollDisable();
		}
	});
	$('.fixo-dimmed').on('click', function(){
		scrollAble();
	});
	$("#header h1 a, #header #gnb a, .btn-top").on('click touchstart', function(e) {
		if($('html').hasClass('expand-menu')){
			scrollAble();
		}
		$('html,body').stop().animate({scrollTop:Math.round($(this.hash).offset().top) - topH}, 600);
		e.preventDefault();
	});
	$('.link-anchor').each(function(){
		$(this).on('click touchstart', function(e) {
			$('html,body').stop().animate({scrollTop:Math.round($(this.hash).offset().top) - topH}, 600);
			e.preventDefault();
		});
	});

	var posY;
	function scrollDisable(){
		posY = $(window).scrollTop();
		$('html').addClass('expand-menu');
		$('#wrap').css('top', -posY);
	}
	function scrollAble(){
		$('html').removeClass('expand-menu');
		posY = $(window).scrollTop(posY);
	}

	set_header();
	$(window).on('scroll', function(){ set_header(); });
	function set_header(e){
		var header_h = $('#header .header-top .top-content').height();
		if($(window).scrollTop() > header_h){
			$('#header').addClass('active');
		} else {
			$('#header').removeClass('active');
		}
	}

	//메뉴현재위치표시
	nowPath();
	$(window).on('scroll', function(){nowPath()});
	function nowPath(){
		var scrollTop = $(window).scrollTop() + $('#header .header-top .gnb-wrap').outerHeight() + 1;
		$('#header .header-top .gnb-wrap #gnb ul li').each(function(){
			reset();
			var now = $(this).find('a').attr('href');
			if(now != '#none' && $(now).length && now != '#wrap'){
				if(scrollTop >= $(now).offset().top && scrollTop < $(now).offset().top+$(now).outerHeight()){
					reset();
					$('#header .header-top .gnb-wrap #gnb ul li').eq($(this).index()).find('a').addClass('active');
					return false;
				}
			} else {
				reset();
			}
		});
		function reset(){
			$('#header .header-top .gnb-wrap #gnb ul li a').removeClass('active');
		}
	}

	setTopB();
	$(window).on('scroll', function(){setTopB()});
	function setTopB(){
		if($(window).scrollTop() > $('#keyvisualMain').height()){
			$('.btn-top').addClass('active');
		} else {
			$('.btn-top').removeClass('active');
		}
	}

	//비급여항목
	$('.btn-nopay').on('click', function(){
		$('.popup-nopay').addClass('active');
		scrollDisable2();
	});
	$('.popup-nopay').on('click', function(){
		$('.popup-nopay').removeClass('active');
		scrollAble2();
	});
	var posY2;
	function scrollDisable2(){
		posY2 = $(window).scrollTop();
		$('html').addClass('expand-nn');
		$('#wrap').css('top', -posY2);
	}
	function scrollAble2(){
		$('html').removeClass('expand-nn');
		posY2 = $(window).scrollTop(posY2);
	}

	//translate even num transform
	fixoTranslate();
	$(window).on('load resize', function(){
		fixoTranslate();
	});
	function fixoTranslate(){
		setTimeout(function(){
			$('.fixo-translate').css({'width':'','height':''}); //reset
			$('.fixo-translate').each(function(){
				var popWidth = Math.ceil($(this).outerWidth()), 
					resultW = popWidth%2;
				if(resultW == 1) {
					var popWidth = popWidth-1;
				}
				$(this).css('width', popWidth);
				var popHeight = Math.ceil($(this).outerHeight()), 
					resultH = popHeight%2;
				if(resultH == 1) {
					var popHeight = popHeight-1;
				}
				$(this).css('height', popHeight);
			});
		},100);
	}
});