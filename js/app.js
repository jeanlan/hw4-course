var tmpl;
// get html template
$.get('thumbnail.html', function(data){
  tmpl = data;
});

var $listRoot = $('.page-list');


// 設定 Facebook AppID
window.fbAsyncInit = function() {
    FB.init({
        appId: '1500484696892805', // 若可以，請換成自己的 App ID !
        xfbml: true,
        version: 'v2.2'
    });

    $('#startBtn').click(function(e){
      //清空結果
      $($listRoot).empty();
      $('#moreBtn').addClass('hide');
      // 臉書登入SDK
      FB.login(function(response) {
        if(response.authResponse) {
            //讀取個人信息
            FB.api( /*填入我們要的request*/, function(response){
              // 把資訊插入到html裡，並顯示出來

              // ---------------
              // 讀取 like 的列表，並儲存到 likes, 以及下一組資料的連結到 next

              //把讀到的資料放進html
              loadPagesInfo(likes);
              // save next request url to moreBtn and show it
            });
        }else{
            console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'user_likes'});//拿使用者喜歡的專頁權限
      e.preventDefault();
    });

    $('#moreBtn').click(function(e){
      $.getJSON( $(this).data('next'), function(response){
        //更新列表資料
      })
      e.preventDefault();
    });
};



// load each pages info and insert to html
var loadPagesInfo = function(pages){

  var counter = 0, //計算現在讀完資料沒
      current = $('<div class="current"></div>').appendTo($listRoot); //定位當前的資料

  pages.forEach(function(item, index){
    //從 template 塞資料
    var $page = $(tmpl).clone();
    FB.api(item.id, function(response){
      // 塞 name, about, like 數到 html 裡。
      FB.api(/*輸入圖片連結*/, function(response){
        // 塞資料到 html 中
        counter++;
        // 塞完資料以後處理一下斷行
        if(counter===pages.length){
          // 利用 .current div:nth-child(3n)，讓每三個page 斷行
          current.children('div').unwrap();
        }
      });
    });
  });
};

