(function()
{      
    window.Data = function(targetBuildData,targetBuildCart,url) 
    {    
        /* --- Инициализация модели данных --*/
        this.item = targetBuildData;  // Jquery элемент куда рисовать данные
        this.cart = targetBuildCart;
        this.dataFromAjax = []; // массив объектов принятых с сервера           
        this.url = url; //определяем откуда брать Ajax скрипт 
        this.sortOrder = 1; // определяем вариант сортировки данных в массиве (по возрастанию (1) или по убыванию (-1))
        this.item.prepend(buildButtonForView());       // Строим кнопки варианта отображения данных             
        var selectOptionForSort = 0;           
        
            
        $.ajax
        ({
            type: "POST",
            url: this.url,
            dataType:"json",
            context: this 
        })         
        .done(function(a) 
        {        
            var itemLength = 5; // Numbers of item buttons 
            if (a.length == 0 || $.isArray(a)==false) // Checked of a wrong Ajax data
            {
                var notification = new NotificationFx // For Notification Alert
                ({
                    wrapper : document.body,
                    message : '<span class="icon icon-megaphone"></span><p class="pStyle">Ошибка в массиве данных</p>',
                    layout : 'bar',
                    effect : 'slidetop',
                    type : 'error',
                    ttl : 60000000,
                    onClose : function() { return false; },
                    onOpen : function() { return false; }
                });
                    notification.show();
                }
            else
            {
                this.dataFromAjax = a;                    
                this.buildData(this.item);
            }
        }).fail(function()
        {
            var notification = new NotificationFx // Error: No Server
            ({
                wrapper : document.body,
                message : '<span class="icon icon-megaphone"></span><p class="pStyle">Нет связи с сервером</p>',
                layout : 'bar',
                effect : 'slidetop',
                type : 'error',
                ttl : 60000000,
                onClose : function() { return false; },
                onOpen : function() { return false; }
            });
            notification.show(); 
        });
        
        this.item.find(".viewTile").data("this",this);  // передаем через Data объект this  - как вариант использования без замыкания
                
                //--Build on click view --//
                
        this.item.find(".viewTile").on("click", function()
        {          
            buildDataByTile($(this).data("this"),$(this).data("this").cart);                                     
        });
                
            //--Build on click view --// // Как пример - делаем замыкание переменной this
                
        this.item.find(".viewList").on("click", function(x)
        {
            return function ()
            {                          
                buildDataByList(x,x.cart); 
            };
        }(this));        
        
        this.item.find(".viewTable").data("this",this);                  
            
        //--Build on click view --//
                
        this.item.find(".viewTable").on("click", function()
        {
            buildDataByTable($(this).data("this"),$(this).data("this").cart);  
        });
        
        this.buildData = function() 
        {   
            var spanForCart = $("<span>");    
            var thForCart1 = $('<th>').html("Товары");
            var thForCart2 = $('<th>').html("Кол");
            var thForCart3 = $('<th>').html("Цена");
            var trForCart = $('<tr>')
                    .append(thForCart1)
                    .append(thForCart2)
                    .append(thForCart3);
                 
            var tbodyForCart = $('<tbody>').addClass("tbodyForCart").append(trForCart).append(buildCart());     
            var buildDataCart = $("<table>").append(tbodyForCart);                
            var divForCart = $("<div>").addClass("body").append(buildDataCart);              // Строим корзину 
                
                
            var iForCart1 = $("<i>").addClass("icon-download");
            var aForCart1 = $("<a>").addClass("btn btn-outlined-invert").css("cursor","pointer")
                    .html("Оформить покупку")
                    .append(iForCart1);

            var iForCart2 = $("<i>").addClass("icon-shopping-cart-content");
            var aForCart2 = $("<a>").addClass("btn btn-outlined-invert").css("cursor","pointer")
                    .html("Товары в корзине")
                    .append(iForCart2);
                
            var divForCart3 = $("<div>").addClass("buttons")
                    .append(aForCart1)
                    .append(aForCart2);
                
            var totalForCart = $("<div>").addClass("total").html("0 грн");                
            var divForCart2 = $("<div>").addClass("footer group").append(divForCart3).append(totalForCart);                
            this.cart.append(spanForCart).append(divForCart).append(divForCart2);
        
            buildDataByTile(this,this.cart);                  
            };  
            
            this.item.find($(".optionForSort")).change(function()
            {               
                selectOptionForSort = $(this).val();
            });
            
            this.item.find(".sortData").data("this",this);            
            this.item.find(".sortData").on("click", function()
            {                  
               var sortorder = $(this).is(".sortFromDownToUp")?-1:1;
               $(this).data("this").dataFromAjax.sort(dataArraySort(sortorder)[selectOptionForSort-1]);   
               selectForBuildData($(this).data("this"));    
           });       
        };
        
  
function dataArraySort(sortorder) // Сортировка массивов.
{
    return  (
            [
                function (a,b)
                {
                 return ((a.PRICE-b.PRICE)*sortorder);
                },
                function (a,b)
                {
                  return (compareBrand(a,b));
                },
                function (a,b)
                {
                  return (compareDescription(a,b));
                },
                function (a,b)
                {
                 return ((a.VOLUME-b.VOLUME)*sortorder);
                },
                function (a,b)
                {
                 return ((a.WEIGHT-b.WEIGHT)*sortorder);
                },
                function (a,b)
                {
                 return ((a.ID-b.ID)*sortorder);
                },
                function (a,b)
                {
                  return (compareName(a,b));
                }                           
            ]);
            
    function compareBrand (a,b) // функция для сравнения текстовых полей в массиве объектов
    {
      if (a.BRAND < b.BRAND)
        return -sortorder;
      if (a.BRAND > b.BRAND)
        return sortorder;
      return 0;
    }
    
   function compareDescription(a,b) // функция для сравнения текстовых полей в массиве объектов
    {
      if (a.DESCRIPTION < b.DESCRIPTION) 
        return -sortorder;
      if (a.DESCRIPTION > b.DESCRIPTION)
        return sortorder;
      return 0;
    }
      
    function compareName(a,b) // функция для сравнения текстовых полей в массиве объектов
    {
      if (a.NAME < b.NAME)
        return -sortorder;
      if (a.NAME > b.NAME)
        return sortorder;
      return 0;
    }
};

function selectForBuildData(data)
{
    if ($(data.item).find(".divForAppendTo").children().hasClass("ElementsByList"))
    { 
        buildDataByList(data,data.cart);
    }
              
    if ($(data.item).find(".divForAppendTo").children().hasClass("ElementsByTile"))
    {        
       buildDataByTile(data,data.cart);
    }
    
    if ($(data.item).find(".divForAppendTo").children().hasClass("buildTable"))
    {    
        buildDataByTable(data,data.cart);
    }
}
       
function buildCart(name,price,id)
{
    if (name!==undefined||price!==undefined)
    {     
        var aForCart = $("<a>").addClass("removeFromCart").css('cursor',"pointer").html(name);
        var tdaForCart = $('<td>')
                .append(aForCart);
        var inputForCart = $('<input>').attr("type",'text').attr('value',"1");
        var tdInputForCart = $("<td>").append(inputForCart);
        var tdPriceForCart = $("<td>").addClass("price").html(price+" грн");
        
        var trForCart2 = $("<tr>").addClass("item").attr("id","id"+id)
                .append(tdaForCart)
                .append(tdInputForCart)
                .append(tdPriceForCart);
        
    return trForCart2;
    }
    else return ($("<tr>").addClass('emptyCart').html("Корзина пустая"));
 };


function buildDataByList(data,dataCart)
{
    data.item.find(".divForAppendTo").remove();
    var divForAppendTo = $("<div>").addClass("divForAppendTo");
    for (var i=0; i<5; i++)
        {
         var id = data.dataFromAjax[i].ID;
         var brand = data.dataFromAjax[i].BRAND;
         var name = data.dataFromAjax[i].NAME;
         var price = data.dataFromAjax[i].PRICE;
         var weight = data.dataFromAjax[i].WEIGHT;
         var volume = data.dataFromAjax[i].VOLUME; 
         var description = data.dataFromAjax[i].DESCRIPTION; 
         data.item.append(divForAppendTo.append(prepareHtmlElementsByList(id,brand,name,price,weight,volume,description)
                 .data("priceList",price)
                 .data("idList",id)
                 .data("nameList",name)));; 
        };
        data.item.find(".addItemToCart").data("thisCart",dataCart).on("click",function()
        {
            var notification = new NotificationFx(
                    {
                        wrapper : document.body,
                        message : '<p>Товар добавлен в корзину</p>',
                        layout : 'growl',
                        effect : 'jelly',
                        type : 'success',
                        ttl : 1500,
                        onClose : function() { return false; },
                        onOpen : function() { return false; }
                    });
            notification.show();
                    
            $(this).data("thisCart").find(".emptyCart").remove();
            var name = $(this).closest(".ElementsByList").data('nameList');
            var price = $(this).closest(".ElementsByList").data('priceList');    
            var id = $(this).closest(".ElementsByList").data('idList'); 
            workInCart($(this).data("thisCart"),id,price,name);
        });
    }
        
function buildDataByTile(data,dataCart)
{
    data.item.find(".divForAppendTo").remove();    
    var divForAppendTo = $("<div>").addClass("divForAppendTo");
    
    for (var i=0; i<5; i++)
    {                        
        var imageTile = data.dataFromAjax[i].IMG;
        var priceTile = data.dataFromAjax[i].PRICE;
        var brandTile = data.dataFromAjax[i].BRAND;
        var descriptionTile = data.dataFromAjax[i].DESCRIPTION;
        var volumeTile = data.dataFromAjax[i].VOLUME;
        var weightTile = data.dataFromAjax[i].WEIGHT;
        var idTile = data.dataFromAjax[i].ID; 
        var nameTile = data.dataFromAjax[i].NAME;
        
        data.item.append((divForAppendTo)
                .append(prepareHtmlElementsByTile(imageTile,priceTile,brandTile, descriptionTile, volumeTile, weightTile,idTile,nameTile)
                .data("priceTile",priceTile)
                .data("idTile",idTile)
                .data("nameTile",nameTile)));
    }
    data.item.find(".imgTile").on('error', function() 
    {
        $(this).attr("src",'img/no_image.gif');
    }); 
    data.item.find(".addItemToCart").data("thisCart",dataCart).on("click",function()
    {
        var notification = new NotificationFx(
                {
                    wrapper : document.body,
                    message : '<p>Товар добавлен в корзину</p>',
                    layout : 'growl',
                    effect : 'jelly',
                    type : 'success',
                    ttl : 1500,
                    onClose : function() { return false; },
                    onOpen : function() { return false; }
                });
        notification.show();                        
        $(this).data("thisCart").find(".emptyCart").remove();
        var name = $(this).closest(".ElementsByTile").data('nameTile');
        var price = $(this).closest(".ElementsByTile").data('priceTile');    
        var id = $(this).closest(".ElementsByTile").data('idTile'); 
        
        
        workInCart($(this).data("thisCart"),id,price,name);
       
});    
}

function buildDataByTable(data,dataCart)
{
      data.item.find(".divForAppendTo").remove(); 
      var thThead1 = $("<th>").html("ID").css("text-align","center");
                    
    var thThead2 = $("<th>").html("Бренд").css("text-align","center");
    var thThead3 = $("<th>").html("Товар").css("text-align","center");
    var thThead4 = $("<th>").html("Цена").css("text-align","center");
    var thThead5 = $("<th>").html("Вес").css("text-align","center");
    var thThead6 = $("<th>").html("Объем").css("text-align","center");
    var thThead7 = $("<th>").html("Корзина").css("text-align","center");

    var trThead = $("<tr>")
            .append(thThead1)
            .append(thThead2)
            .append(thThead3)
            .append(thThead4)
            .append(thThead5)
            .append(thThead6)
            .append(thThead7);

    var thead = $("<thead>").append(trThead);                    
    var tableThead = $("<table>").addClass("table table-bordered buildTable")
            .append(thead)
            .append($("<tbody>").addClass("tbodyApendData").css("text-align","center"));                     

    var divForAppendTo = $("<div>").addClass("divForAppendTo")
            .append(tableThead);                    

    for (var i=0; i<5; i++)
    { 
         var id = data.dataFromAjax[i].ID;
         var brand = data.dataFromAjax[i].BRAND;
         var name = data.dataFromAjax[i].NAME;
         var price = data.dataFromAjax[i].PRICE;
         var weight = data.dataFromAjax[i].WEIGHT;
         var volume = data.dataFromAjax[i].VOLUME;

         tableThead.append(prepareHtmlElementsByTable(id,brand,name,price,weight,volume).addClass("ElementsByTable")
                 .data("priceTable",price)
                 .data("idTable",id)
                 .data("nameTable",name));                         
    } 

    data.item.append(divForAppendTo); 

    data.item.find(".addItemToCart").data("thisCart",dataCart).on("click",function()
    {

        var notification = new NotificationFx(
                {

        // element to which the notification will be appended
        // defaults to the document.body
        wrapper : document.body,

        // the message
        message : '<p>Товар добавлен в корзину</p>',

        // layout type: growl|attached|bar|other
        layout : 'growl',

        // effects for the specified layout:
        // for growl layout: scale|slide|genie|jelly
        // for attached layout: flip|bouncyflip
        // for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
        // ...
        effect : 'jelly',

        // notice, warning, error, success
        // will add class ns-type-warning, ns-type-error or ns-type-success
        type : 'success',

        // if the user doesn´t close the notification then we remove it 
        // after the following time
        ttl : 1500,

        // callbacks
        onClose : function() { return false; },
        onOpen : function() { return false; }

    });

    // show the notification
    notification.show();

    $(this).data("thisCart").find(".emptyCart").remove();
    var name = $(this).closest(".ElementsByTable").data('nameTable');
    var price = $(this).closest(".ElementsByTable").data('priceTable');     
    var id = $(this).closest(".ElementsByTable").data('idTable'); 

     workInCart($(this).data("thisCart"),id,price,name);
});
}                    
   
function workInCart(thisData,id,price,name)

{
     var allTotalCart=[];
     if (thisData.find("#id"+id).length == 0)
     {                      
        var allTotalCart=[];
        thisData.find(".tbodyForCart").append(buildCart(name,price,id));
        thisData.find(".price").each(function()
           {
               allTotalCart[allTotalCart.length] = $(this).html().split(' ')[0];  

           });
        thisData.find(".total").html(_.sum(allTotalCart)+" грн");
        thisData.find("#id"+id).find(".removeFromCart").data("thisCart",$(this).data("thisCart")).data("thisID",id).on("click",function()
            {
                var allTotalCart=[];
                var i = thisData;
               // var thisID = $(this).data("thisID");                              
                $(this).closest("tr").remove(); 

                $(i).find(".price").each(function()
           {
               allTotalCart[allTotalCart.length] = $(this).html().split(' ')[0];  
           });

            $(i).find(".total").html(_.sum(allTotalCart)+" грн");
            if (i.find('.removeFromCart').length==0)
            {
                i.find(".tbodyForCart").append($("<tr>").addClass('emptyCart').html("Корзина пустая"))
                $(i).find(".total").html("0 грн");
            }
        });
    }
    else
    {
        var allTotalCart=[];
        var CartInput = thisData.find("#id"+id).find("input").val();
        var CartPrice = +thisData.find("#id"+id).find(".price").html().split(' ')[0];


        CartInput++;
        CartPrice=CartPrice+price;
        thisData.find("#id"+id).find("input").val(CartInput);
        thisData.find("#id"+id).find(".price").html(CartPrice+" грн");
        thisData.find(".price").each(function()
        {
            allTotalCart[allTotalCart.length] = $(this).html().split(' ')[0];

        });   
        thisData.find(".total").html(_.sum(allTotalCart)+" грн");  
    };
    
}   
   
   
   
             
function buildButtonForView()   // Кнопки варианта отображения данных и панель сортировки по любому полю товара 
{
    var spanViewList = $("<span>").addClass("glyphicon glyphicon-list").attr("aria-hidden","true").css({"margin-right":"0","font-weight":"normal"});
    var butonViewList = $("<button>").addClass("btn btn-info viewList").attr("aria-label","Left Align")
            .append(spanViewList);
    var spanViewTable = $("<span>").addClass("glyphicon glyphicon-align-justify").attr("aria-hidden","true").css({"margin-right":"0","font-weight":"normal"});
    var butonViewTable = $("<button>").addClass("btn btn-info viewTable").attr("aria-label","Left Align")
            .append(spanViewTable);
    var spanViewTale = $("<span>").addClass("glyphicon glyphicon-th-large").attr("aria-hidden","true").css({"margin-right":"0","font-weight":"normal"});
    var butonViewTile = $("<button>").addClass("btn btn-info viewTile").attr("aria-label","Left Align")
            .append(spanViewTale);
    var optionForSort0 = $("<option>").attr({"value":"","disabled":"","selected":""}).html("Сортировка");
    var optionForSort1 = $("<option>").attr("value","1").html("Цена");
    var optionForSort2 = $("<option>").attr("value","2").html("Бренд");
    var optionForSort7 = $("<option>").attr("value","7").html("Товар");
    var optionForSort3 = $("<option>").attr("value","3").html("Описание");
    var optionForSort4 = $("<option>").attr("value","4").html("Объем");
    var optionForSort5 = $("<option>").attr("value","5").html("Вес");
    var optionForSort6 = $("<option>").attr("value","6").html("ИД");
    var selectForSort = $("<select>").addClass("form-control optionForSort")
            .css({"display":"inline-block","width":"200px","height":"35px"})
            .append(optionForSort0)
            .append(optionForSort1)
            .append(optionForSort2)
            .append(optionForSort3)
            .append(optionForSort4)
            .append(optionForSort5)
            .append(optionForSort6)
            .append(optionForSort7);
    
    var spanSortDown = $("<span>").addClass("glyphicon glyphicon-sort-by-attributes-alt").attr("aria-hidden","true").css({"margin-right":"0","font-weight":"normal"});
    var butonSortDown = $("<button>").addClass("btn btn-info sortData sortFromDownToUp").attr("aria-label","Left Align")
            .append(spanSortDown);
    var spanSortUp = $("<span>").addClass("glyphicon glyphicon-sort-by-attributes").attr("aria-hidden","true").css({"margin-right":"0","font-weight":"normal"});
    var butonSortUp = $("<button>").addClass("btn btn-info sortData sortFromUpToDown").attr("aria-label","Left Align")
            .append(spanSortUp);
    
    var divForView1 = $("<div>").addClass("btn-group-xs").css("margin-bottom","10px")
            .append(butonViewList)
            .append(butonViewTable)
            .append(butonViewTile);
    
    var divButton1 = $("<div>").addClass("col-lg-3 col-md-3 col-sm-4").css({"margin-top":"10px"})  
            .append(divForView1);  
    var divButton2 = $("<div>").addClass("col-lg-3 col-md-3 col-sm-4")
            .append(selectForSort);       
    
    var divForView2 = $("<div>").addClass("btn-group-xs").css({"margin-bottom":"10px","margin-top":"10px"})  
            .append(butonSortDown)
            .append(butonSortUp);
    
    var divButton3 = $("<div>").addClass("col-lg-2 col-md-3 col-sm-4").css({"margin-left":"-40px"})  
            .append(divForView2);  
    
    var divForButtonRow = $("<div>").addClass("row")
            .append(divButton1)
            .append(divButton2)
            .append(divButton3);
    
    return divForButtonRow;    
}
    
    
function prepareHtmlElementsByTile(imageTile,priceTile,brandTile,descriptionTile,volumeTile,weightTile,idTile,nameTile) // Инициализируем HTML объекты под вывод плиткой
{    
    var span1 = $("<span>").addClass("active");
    var span2 = $("<span>").addClass("active");
    var span3 = $("<span>").addClass("active");
    var span4 = $("<span>");
    var span5 = $("<span>");
    var divRate = $("<div>").addClass("rate")
            .append(span1)
            .append(span2)
            .append(span3)
            .append(span4)
            .append(span5);
    var iIconShoppingCart = $("<i>").addClass("icon-shopping-cart");
    var spanToCart = $("<span>").html("В корзину");
    var aAddCartBtn = $("<a>").addClass("add-cart-btn addItemToCart").css("cursor",'pointer')
            .append(spanToCart)
            .append(iIconShoppingCart);
    var aFacebookSquare = $("<a>").addClass("fa fa-facebook-square").attr("href","#");
    var aTwitterSquare = $("<a>").addClass("fa fa-twitter-square").attr("href","#");
    var aGoogleSquare = $("<a>").addClass("fa fa-google-plus-square").attr("href","#");
    var divHoverState = $("<div>").addClass("hover-state")
            .append(aFacebookSquare)
            .append(aTwitterSquare)
            .append(aGoogleSquare);                
    var iShare = $("<i>").addClass("fa fa-share");              
    var divShareBtn = $("<div>").addClass("share-btn")
            .append(iShare)
            .append(divHoverState);

    var divHoverState1 = $("<div>").addClass("hover-state").html("Wishlist");
    var iFaplus = $("<i>").addClass("fa fa-plus");
    var aWishlistBtn = $("<a>").addClass("wishlist-btn").attr("href","#")
            .append(divHoverState1)
            .append(iFaplus);
    var divTools = $("<div>").addClass("tools")
            .append(divRate)
            .append(aAddCartBtn)
            .append(divShareBtn)                
            .append(aWishlistBtn); 
    var aFooter = $("<a>").attr("href","#").html(descriptionTile);
    var spanFooterBrand = $("<span>").html("Бренд: "+brandTile);
    var spanFooterName = $("<span>").addClass('nameofName').html('Товар: '+nameTile);
    var divaFooter = $("<div>").css({"max-height":"125px","overflow-y":"auto"})                
            .append(aFooter);
    var spanFooterVolume = $("<span>").html("Объем: "+volumeTile);
    var spanFooterWeight = $("<span>").html("Вес: "+weightTile);
    var spanFooterId = $("<span>").html("ИД: "+idTile);
    var divFooter = $("<div>").addClass("footer") 
            .append(spanFooterBrand)
            .append(spanFooterName)
            .append(divaFooter)                
            .append(spanFooterVolume)
            .append(spanFooterWeight) 
            .append(spanFooterId)  
            .append(divTools);
     var imgTile = $("<img>").addClass("imgTile text-center").attr("src",imageTile).attr("alt","1");        
     var divImageTile = $("<div>").addClass("divImageTile").css({"min-height":"200px","max-height":"200px"}).append(imgTile);
     var aTitle = $("<a>").attr("href","#")
             .append(divImageTile);
    var divPrice = $("<div>").addClass("price-label").html(priceTile+" грн");
    var spanSale = $("<span>").addClass("sale");
    var divBadges  = $("<div>").addClass("badges")
            .append(spanSale);
    var divTile = $("<div>").addClass("tile")
            .append(divBadges)
            .append(divPrice)
            .append(aTitle)
            .append(divFooter);
    var divCol = $("<div>").addClass("col-lg-3 col-md-4 col-sm-6 ElementsByTile")
            .append(divTile);      

    return divCol;
}

    
function prepareHtmlElementsByTable(Id,Brand,Name,Price,Weight,Volume) // Инициализируем HTML объекты под вывод плиткой
{
    var tdTbody1 = $("<td>").addClass("thTbodyId").html(Id);
    var tdTbody2 = $("<td>").addClass("thTbodyBrand").html(Brand);
    var tdTbody3 = $("<td>").addClass("thTbodyItem").html(Name);
    var tdTbody4 = $("<td>").addClass("thTbodyPrice").html(Price);
    var tdTbody5 = $("<td>").addClass("thTbodyWeight").html(Weight);
    var tdTbody6 = $("<td>").addClass("thTbodyVolume").html(Volume);


    var iIconShoppingCart = $("<i>").addClass("icon-shopping-cart");
    var spanToCart = $("<span>").html("В корзину");
    var aAddCartBtn = $("<a>").addClass("add-cart-btn addItemToCart").css("cursor","pointer")
            .append(spanToCart)
            .append(iIconShoppingCart);        

    var tdTbody7 = $("<td>").addClass("thTbodyTile").append(aAddCartBtn);

    var trTbody = $("<tr>")
            .append(tdTbody1)
            .append(tdTbody2)
            .append(tdTbody3)
            .append(tdTbody4)
            .append(tdTbody5)
            .append(tdTbody6)
            .append(tdTbody7);        

    return trTbody;        
}
    
    
function prepareHtmlElementsByList(id,brand,name,price,weight,volume,description) // Инициализируем HTML объекты под вывод списком
{
    var liForList0 = $("<li>").html(description);
    var liForList1 = $("<li>").html("Цена: "+price+" грн"); 
    var liForList2 = $("<li>").html("Объем: "+volume);
    var liForList3 = $("<li>").html("Вес: "+weight);
    var ul1 = $("<ul>")
            .append(liForList0)
            .append(liForList1)
            .append(liForList2)
            .append(liForList3);
    var iIconShoppingCart = $("<i>").addClass("icon-shopping-cart");        
    var spanToCart = $("<span>").html("В корзину");
    var aAddCartBtn = $("<a>").addClass("add-cart-btn addItemToCart").css({"margin-left":"50px","cursor":"pointer"})
            .append(spanToCart)
            .append(iIconShoppingCart); 

    var liForTitle = $("<li>").html(name).append(aAddCartBtn)
            .append(ul1);

    var ul2 = $("<ul>").append(liForTitle);



    var liForBrand = $("<li>").html("Бренд: "+brand).css("font-size","1em")                                
            .append(ul2);

    var ul3 = $("<ul>").append(liForBrand);

    var liForId = $("<li>").html(id).css("font-size","1.75em")
            .append(ul3);

    var ul4 = $("<ul>").addClass("ElementsByList").append(liForId);



    return ul4;
}

})();