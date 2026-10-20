//main
$(function(){
	AOS.init({ offset: 200, delay: 0, duration: 800, once: true });

	// resizekeyvisualMain();
	// $(window).on('resize', function(){resizekeyvisualMain()});
	// function resizekeyvisualMain(){
	// 	if(window.innerWidth > 1279){
	// 		$('#keyvisualMain .slide').height($(window).height() - $('#header').height());
	// 	} else {
	// 		$('#keyvisualMain .slide').height($(window).height());
	// 	}
	// }
	// $('#keyvisualMain .slide .swiper-slide').each(function(index){
	// 	var index = index+1, 
	// 		url = $(this).find('.box-image img').attr('src');
	// 	$(this).find('.box-image').css('background-image', 'url('+url+')');
	// 	$(this).addClass('item'+index);
	// });
	// var keyvisualMain = new Swiper('#keyvisualMain .slide',{
	// 	autoplay: { delay: 5000, disableOnInteraction: false },
	// 	speed: 800, 
	// 	loop: true, 
	// 	effect: 'slide', 
	// 	navigation: {
	// 		nextEl: '#keyvisualMain .slide .arrow-next', 
	// 		prevEl: '#keyvisualMain .slide .arrow-prev', 
	// 	}, 
	// 	pagination: {
	// 		el: '#keyvisualMain .slide .pagination', type: 'bullets', clickable: true
	// 	}, 
	// 	on: {
	// 		slideChangeTransitionEnd: function(){
	// 			$('#keyvisualMain .slide .swiper-slide [data-ani]').removeClass('fixo-animate');
	// 			$('#keyvisualMain .slide .swiper-slide.item'+(this.realIndex+1)+' [data-ani]').addClass('fixo-animate');
	// 		}
	// 	}
	// });

	// $('#section06 .tabslide .swiper-slide').each(function(index){
	// 	var index = index+1;
	// 	$(this).addClass('item'+index);
	// });
	// var slide01 = new Swiper('#section06 .tabslide',{
	// 	//autoplay: { delay: 5000, disableOnInteraction: false },
	// 	speed: 400, 
	// 	loop: true, 
	// 	effect: 'fade', 
	// 	fadeEffect: { crossFade: true },
	// 	autoHeight: true,
	// 	navigation: {
	// 		nextEl: '#section06 .tabslide .arrow-next', 
	// 		prevEl: '#section06 .tabslide .arrow-prev', 
	// 	}, 
	// 	on: {			
	// 		slideChangeTransitionStart: function(){
	// 			$('#section06 .tabmenu a').eq(this.realIndex).addClass('selected').siblings().removeClass('selected');
	// 		},
	// 		slideChangeTransitionEnd: function(){
	// 			$('#section06 .tabslide .swiper-slide [data-ani]').removeClass('fixo-animate');
	// 			$('#section06 .tabslide .swiper-slide.item'+(this.realIndex+1)+' [data-ani]').addClass('fixo-animate');
	// 		}
	// 	}
	// });
	// $('#section06 .tabmenu a').on('click', function(){
	// 	$(this).addClass('selected').siblings().removeClass('selected');
	// 	slide01.slideTo($(this).index()+1);
	// });

	$('.cmn-tabmenu .item a').on('click', function(){
		//$(this).parent().addClass('selected').siblings().removeClass('selected');
		$(this).closest('.cmn-tabmenu').next('.cmn-cont-wrap').find(' > .cont').eq($(this).parent().index()).addClass('active').siblings().removeClass('active');
	});

	let gallery = new Swiper('#gallery',{
		autoplay: { delay: 3000, disableOnInteraction: false },
		speed: 800, 
		loop: true, 
		effect: 'fade', 
		navigation: {
			nextEl: '#gallery .arrow-next', 
			prevEl: '#gallery .arrow-prev', 
		}
	});
	$('#section11 .img-btn img').on('click', function(){
		var num = $(this).parent().index()+1;
		gallery.slideTo(num);
	});

	$('.cmn-tabmenu .item a').on('click', function(){
		$(this).addClass('selected').parent().siblings().find('a').removeClass('selected');
	});
});