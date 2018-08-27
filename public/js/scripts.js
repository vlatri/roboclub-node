$(document).ready(function() {
  var $body = $('body')[0]
  var $loader = $('.preloader')

  if ($loader.size() > 0) {
    setTimeout(function() {
      $loader[0].style.opacity = 0
      $loader[0].style.visibility = 'hidden'
      $body.style.overflow = 'visible'
    }, 1500)
  }
})

$(function() {
  $('.quotes-slider__photo').hide()
  $('.quotes-slider').slick({
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: false,
    pauseOnDotsHover: true,
    dots: true,
    dotsClass: 'quotes-slider__nav',
    customPaging: function(slider, i) {
      var $pic = slider.$slides.eq(i).find('.quotes-slider__photo')

      return $pic.clone().show()
    }
  })

  /*---------------------------------------------------*/

  $('body').on('change', '.courses-filter select', function() {
    const $itemsToFilter = $('.courses .preview')
    const ageVal = $('select[data-filter="age"]').val()
    const catVal = $('select[data-filter="cat"]').val()

    const filterFunc = (i, el) => {
      const minAge = +$(el).data('min-age')
      const maxAge = +$(el).data('max-age')
      const age = parseFloat(ageVal)
      const cat = $(el).data('cat')

      if(ageVal === 'all' || (age >= minAge && age <= maxAge) || minAge === 0)
        if(catVal === 'all' || catVal === cat) return true
      return false
    }

    const $itemsToShow = $itemsToFilter.filter(filterFunc)
    const $itemsToHide = $itemsToFilter.filter((i, el) => !filterFunc(i, el))

    $itemsToHide.hide(300).add('filtered')
    $itemsToShow.show(300).removeClass('filtered')

  })

  /*---------------------------------------------------*/

  $('input[placeholder], textarea[placeholder]').placeholder()

})

$(document).ready(function() { // Course share buttons
  // Doesn't work for localhost at all.
  $('.fb-share').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+window.location)
  $('.twitter-share').attr('href', 'https://twitter.com/intent/tweet?url='+window.location)
})

$(document).ready(function() { // FAQ Sliding
  var sliderSpeed = 300

  $('.faq-wrapper .item-wrapper').click(function() {
    var $this = $(this)
    var currItem = $this.attr('id').slice(-1)
    if($this.hasClass('open')) {
      $this.removeClass('open')
      $('[id^=item-subtitle-'+currItem+']').slideUp(sliderSpeed).removeClass('open')
      $('[id^=item-text-'+currItem+']').slideUp(sliderSpeed)
    }
    else {
      $this.addClass('open')
      $('[id^=item-subtitle-'+currItem+']').slideDown(sliderSpeed)
    }
  })

  $('.faq-wrapper .subtitle-wrapper').click(function(event) {
    event.stopPropagation()
    var $this = $(this)
    var currItem = $this.attr('id').slice(-3)
    if($this.hasClass('open')) {
      $this.removeClass('open')
      $('#item-text-'+currItem).slideUp(sliderSpeed)
    }
    else {
      $this.addClass('open')
      $('#item-text-'+currItem).slideDown(sliderSpeed)
    }
  })

  $('.faq-wrapper .text-wrapper').click(function(event) {
    event.stopPropagation()
    var $this = $(this)
    var currItem = $this.attr('id').slice(-3)
    if($this.parent().find('.subtitle-wrapper').hasClass('open')) {
      $this.parent().find('.subtitle-wrapper').removeClass('open')
      $('#item-text-'+currItem).slideUp(sliderSpeed)
    }
    else {
      $this.parent().find('.subtitle-wrapper').addClass('open')
      $('#item-text-'+currItem).slideDown(sliderSpeed)
    }
  })
})

$(document).ready(function() {
  $('.gallery-preview-slider').slick({
    lazyLoad: 'progressive',
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    slidesToShow: 4,
    adaptiveHeight: true,
    swipeToSlide: true,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        arrows: false
      }
    }],
  })
  $('.swipebox').swipebox({ loopAtEnd: true })
  $('.slick-news-slider').slick({
    lazyLoad: 'progressive',
    draggable: false,
    infinite: true,
    prevArrow: '.slick-news-slider-prev',
    nextArrow: '.slick-news-slider-next',
  })
})


$.fn.filterData = function(key, value, equality) {
  return this.filter(function() {
    return equality ?
      $(this).data(key) == value :
      $(this).data(key) != value
  })
}

$(document).ready(function() { // Gallery filter
  $('.filter-button').on('click', function() {
    $('.filter-button.active').removeClass('active')
    $(this).addClass('active')

    const filterType = 'type'
    const filterVal = $(this).data('filter')
    const $filteredItems = $('.preview')

    if (!filterType) return 0
    if(filterVal === 'all') return $filteredItems.show(300).addClass('swipebox')

    const filterFunc = (i, el) => $(el).data(filterType) == filterVal

    const $itemsToShow = $filteredItems.filter(filterFunc)
    const $itemsToHide = $filteredItems.filter((i, el) => !filterFunc(i, el))

    $itemsToHide.hide(300).removeClass('swipebox')
    $itemsToShow.show(300).addClass('swipebox')

  })
})

$(document).ready(function (){
  $.fatNav()
  const $scroll = () => $('html, body').animate({ scrollTop: $('.contacts-section').offset().top - $('.header').height() }, 1000)
  $('.main-nav [data-navlink-key="contacts"]').click($scroll)
  $('.fat-nav [data-navlink-key="contacts"]').click(() => {
    $scroll()
    $.fatNav().toggleNav()
    $('.hamburger.active').removeClass('active')
  })
})
