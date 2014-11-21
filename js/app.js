var tmpl;
// get html template  
// Template 網頁可獨立成另一個頁面，在動態讀取進來
// 用 ajax 方法 load 進來，所以 javascript 可以動態得圖取網頁資料
$.get('thumbnail.html', function(data){
  tmpl = data;
});

var $listRoot = $('.page-list');


// 設定 Facebook AppID
window.fbAsyncInit = function() {
    FB.init({
        appId: '1562101984021560', // 若可以，請換成自己的 App ID !
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
            // 課堂練習四: '/me?fields=name,picture'
            // 課堂練習五: likes.limit(60)  => 每次顯示60個按讚的結果
            FB.api( '/me?fields=name,picture, likes.limit(60)', function(response){
              // 把資訊插入到html裡，並顯示出來
              $('.user-name').text(response.name);
              $('.user-photo').attr('src', response.picture.data.url);
              
              // 課堂練習四 隱藏 "你按過讚的粉絲專頁有：" 這串文字
              // html 先加上hide class： <section id="user" 加: class="hide">
              // 下面這邊要加上 removeClass，此時hide不需要 .hide 因為用 removeClass 已知hide 是 class
              $('#user').removeClass('hide');

              // ---------------
              // 課堂練習五 讀取 like 的列表，並儲存到 likes, 以及下一組資料的連結到 next
              // 從 Graphic API 看出得到的資料是 是array形式
              var likes = response.likes.data;


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
    //從 template 塞資料  $page 加個$ 表示使用 jQuery的變數
    var $page = $(tmpl).clone();
    // 先搜尋 id 拿到更多資料
    FB.api(item.id, function(response){
      // 塞 name, about, like 數到 html 裡。
      // 變數(title, about, likes)叫什麼名字可以去 https://developers.facebook.com/tools/explorer 查
      // 因為是 class, 要加.: .title, .about, .likes
      $page.find('.title a').text(response.name).attr('href',response.link);
      $page.find('.about').text(response.about);
      $page.find('.likes').text(response.likes);

      FB.api(item.id+'/picture?type=large', function(response){
        // 塞資料到 html 中
        // 找到 thumbnail的 img 他的屬性是 src ，把連結取代
        $page.find('.thumbnail img').attr('src', response.data.url);
        
        // 要把一個一個插入目前的index 裡面，使用 current
        $page.appendTo(current);
        counter++; // 紀錄60 個都插入完畢
        
        // 塞完資料以後處理一下斷行
        if(counter===pages.length){
          // 利用 .current div:nth-child(3n)，讓每三個page 斷行 清除 float
          $('.current div:nth-child(3n)').after( '<div class="clearfix"></div>)');
          current.children('div').unwrap();
        }
      });
    });
  });
};

