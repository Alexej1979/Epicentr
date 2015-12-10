(function()
{   
    window.Data = function(targetBuildData,targetBuildCart,url,start,count) 
    {    
        /* --- Инициализация модели данных --*/
        this.item = targetBuildData;  // Jquery элемент куда рисовать данные
        this.cart = targetBuildCart;
        this.numberOfPage = 1;
        this.start = start;
        this.count = count;
        this.brand = "";
        this.deferred = $.Deferred(); // используем для подписки на добавление товара в корзину
        this.currentView = "Tile";
        this.dataFromAjax = []; // массив объектов принятых с сервера           
        this.url = url; //определяем откуда брать Ajax скрипт 
        this.sortOrder = 1; // определяем вариант сортировки данных в массиве (по возрастанию (1) или по убыванию (-1))
        this.item.prepend(buildButtonForView());       // Строим кнопки варианта отображения данных             
        var selectOptionForSort = 0;
        
        ajax(this); // получаем данные Аджакс;
                              
                              // Строим корзину 
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
            var divForCart = $("<div>").addClass("body").append(buildDataCart);              
                
                
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
                
            var totalForCart = $("<div>").addClass("total priceToCart").html("0 грн"); 
            var volumeForCart = $("<div>").addClass("total volumeForCart").html("0 м3 объем").css({"font-size":"1.0em","margin-top":"-30px"});
            var weightForCart = $("<div>").addClass("total weightForCart").html("0 кг вес").css({"font-size":"1.0em","margin-top":"-30px"});
            var deliveryForCart = $("<div>").addClass("total deliveryForCart").html("0 грн доставка").css({"font-size":"1.0em","margin-top":"-30px"});
            var divForCart2 = $("<div>").addClass("footer group")
                    .append(divForCart3)
                    .append(totalForCart);
            
            var divForCart4 = $("<div>").addClass("footer group")
                    .append(volumeForCart);
            
            var divForCart5 = $("<div>").addClass("footer group")
                    .append(weightForCart);
            
            var divForCart6 = $("<div>").addClass("footer group")
                    .append(deliveryForCart);
            
            this.cart.append(spanForCart)
                    .append(divForCart)
                    .append(divForCart2)
                    .append(divForCart4)
                    .append(divForCart5)
                    .append(divForCart6);
            
            
            this.getDeferred = function()
            {
                return this.deferred.promise();
            };
            
             // строим пагинацию
            
              this.item.twbsPagination 
              ({ 
              totalPages: 35, 
              visiblePages: 7,
              onPageClick: function (z) 
              { 
                 return function(event, page)
                 {
                    z.numberOfPage = page;                
                    z.start = z.count*(z.numberOfPage-1); 
                    z.brand = z.item.find(".inputForBrand").val();
                    ajax(z); // Аджакс;
                 };
              }(this)
            });            
               
        this.item.find(".viewTile").data("this",this);  // передаем через Data объект this  - как вариант использования без замыкания
                
                //--Build on click view --//
                
        this.item.find(".viewTile").on("click", function() // вид отображения плиткой
        {         
            $(this).data("this").currentView = "Tile";
            // строим пагинацию
            
              $(this).data("this").item.twbsPagination 
              ({ 
              totalPages: 35, 
              visiblePages: 7,
              onPageClick: function (z) 
              { 
                 return function(event, page)
                 {
                    z.numberOfPage = page;                
                    z.start = z.count*(z.numberOfPage-1); 
                    z.brand = z.item.find(".inputForBrand").val();
                    ajax(z); // получаем данные Аджакс;
                 };
              }($(this).data("this"))
            });  
            
            buildDataByTile($(this).data("this"),$(this).data("this").cart); // строим плитку
            
        });
                
            //--Build on click view --// // Как пример - делаем замыкание переменной this
                
        this.item.find(".viewList").on("click", function(x) // вид отображения списком
        {
            return function ()
            {    
              x.currentView = "List";
            // строим пагинацию
            
              x.item.twbsPagination 
              ({ 
              totalPages: 35, 
              visiblePages: 7,
              onPageClick: function (z) 
              { 
                 return function(event, page)
                 {
                    z.numberOfPage = page;                
                    z.start = z.count*(z.numberOfPage-1); 
                    z.brand = z.item.find(".inputForBrand").val();
                    ajax(z); // получаем данные Аджакс;
                 };
              }(x)
            });  
                
                buildDataByList(x,x.cart); // строим список
            };
        }(this));        
        
        this.item.find(".viewTable").data("this",this);                  
            
        //--Build on click view --//
                
        this.item.find(".viewTable").on("click", function() //вид отображения таблицей
        {
             
             $(this).data("this").currentView = "Table";
            // строим пагинацию
            
              $(this).data("this").item.twbsPagination 
              ({ 
              totalPages: 35, 
              visiblePages: 7,
              onPageClick: function (z) 
              { 
                 return function(event, page)
                 {
                    z.numberOfPage = page;                
                    z.start = z.count*(z.numberOfPage-1); 
                    ajax(z); // получаем данные Аджакс;
                 };
              }($(this).data("this"))
            });  
            
            buildDataByTable($(this).data("this"),$(this).data("this").cart);  // строим таблицу
        });
        
        this.buildData = function(dataThis)  // при загрузке страницы, после получения данных от аджакса
        {   
            buildDataByTile(dataThis,dataThis.cart); 
        };  
            
            this.item.find($(".optionForSort")).change(function() // выбираем по какому принципу сортировать товар
            {               
                selectOptionForSort = $(this).val();
            });
            
            this.item.find(".sortData").data("this",this);            
            this.item.find(".sortData").on("click", function() // событие нажатия кнопки сортировки
            {                  
               var sortorder = $(this).is(".sortFromDownToUp")?-1:1; // сортируем по убыванию или по возрастанию
               $(this).data("this").dataFromAjax.sort(dataArraySort(sortorder)[selectOptionForSort-1]);   
               selectForBuildData($(this).data("this"));    
           });  
           
           this.item.find(".choiceForBrand").data("this",this);
           
           this.item.find(".choiceForBrand").on("click", function() //сортировка по бренду 
           {
               $(this).data("this").brand = $(this).data("this").item.find(".inputForBrand").val();              
               ajax($(this).data("this"), $(this).data("this").brand);               
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
       
function buildCart(name,price,id,weightForCart,volumeForCart)
{
    if (name!==undefined||price!==undefined)
    {     
        var aForCart = $("<a>").addClass("removeFromCart").css('cursor',"pointer").html(name);
        var tdaForCart = $('<td>')
                .append(aForCart);
        var inputForCart = $('<input>').attr("type",'text').attr('value',"1").prop('readonly', true);
        var tdInputForCart = $("<td>").append(inputForCart);
        var tdPriceForCart = $("<td>").addClass("price")
                .attr("weightForCart",weightForCart)
                .attr("volumeForCart",volumeForCart)
                .html(price+" грн");
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
    for (var i=0; i < data.count && i < data.dataFromAjax.length; i++)
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
                 .data("volumeForCart",volume)
                 .data("weightForCart",weight)
                 .data("nameList",name)));; 
        };
        data.item.find(".addItemToCart").data("thisCart",dataCart).data("thisCart",dataCart).on("click",function()
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
            
            var volumeForCart = $(this).closest(".ElementsByList").data("volumeForCart");
            var weightForCart = $(this).closest(".ElementsByList").data("weightForCart"); 
            
            workInCart($(this).data("thisCart"),id,price,name,weightForCart,volumeForCart);
            $(this).data("thisData").deferred.notify(name); // возвращаем подписку на добавление товара в корзину
        });
    }
        
function buildDataByTile(data,dataCart)
{
    
    data.item.find(".divForAppendTo").remove();    
    var divForAppendTo = $("<div>").addClass("divForAppendTo");
    
    for (var i=0; i < data.count && i < data.dataFromAjax.length; i++)
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
                .data("volumeForCart",volumeTile)
                .data("weightForCart",weightTile)
                .data("nameTile",nameTile)));
    }
    data.item.find(".imgTile").on('error', function() 
    {
        $(this).attr("src",'img/no_image.gif');
    }); 
    
    data.item.find(".addItemToCart").data("thisCart",dataCart).data("thisData",data).on("click",function()
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
        var volumeForCart = $(this).closest(".ElementsByTile").data("volumeForCart");
        var weightForCart = $(this).closest(".ElementsByTile").data("weightForCart"); 
        
        workInCart($(this).data("thisCart"),id,price,name,weightForCart,volumeForCart);
       $(this).data("thisData").deferred.notify(name); // возвращаем подписку на добавление товара в корзину
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

    for (var i=0; i < data.count && i < data.dataFromAjax.length; i++)
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
                 .data("volumeForCart",volume)
                 .data("weightForCart",weight)
                 .data("nameTable",name));                         
    } 

    data.item.append(divForAppendTo); 
    
   
    data.item.find(".addItemToCart").data("thisCart",dataCart).data("thisData",data).attr("numbersClick","0").on("click",function()
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
    var name = $(this).closest(".ElementsByTable").data('nameTable');
    var price = $(this).closest(".ElementsByTable").data('priceTable');     
    var id = $(this).closest(".ElementsByTable").data('idTable');       
    var volumeForCart = $(this).closest(".ElementsByTable").data("volumeForCart");
    var weightForCart = $(this).closest(".ElementsByTable").data("weightForCart"); 

    workInCart($(this).data("thisCart"),id,price,name,weightForCart,volumeForCart);
    
    $(this).data("thisData").deferred.notify(name); // возвращаем подписку на добавление товара в корзину
});
}                    
   
function workInCart(thisData,id,price,name,weightForCart,volumeForCart)   // Работа с данными в корзине

{
   
     var allTotalCart=[];
     var allVolumeForCart=[];
     var allWeightForCart=[];
     if (thisData.find("#id"+id).length == 0)
     {                      
        
        thisData.find(".tbodyForCart").append(buildCart(name,price,id,weightForCart,volumeForCart));
        
        setDataInCart(thisData);
        
        thisData.find("#id"+id).find(".removeFromCart").data("thisCart",$(this).data("thisCart")).data("thisID",id).on("click",function()
            {
                var allTotalCart=[];
                var allVolumeForCart=[];
                var allWeightForCart=[];
                var i = thisData;                                         
                $(this).closest("tr").remove(); 
                
                setDataInCart(i);
                
            if (i.find('.removeFromCart').length==0)
            {
                i.find(".tbodyForCart").append($("<tr>").addClass('emptyCart').html("Корзина пустая"))
                $(i).find(".priceToCart").html("0 грн");
                $(i).find(".volumeForCart").html("0 м3 объем");
                $(i).find(".weightForCart").html("0 кг вес");
                $(i).find(".deliveryForCart").html("0 грн доставка");
               
            }
        });
    }
    else
    {
        var allTotalCart=[];
        var allTotalCart=[];
        var allVolumeForCart=[];
        var CartInput = thisData.find("#id"+id).find("input").val();
        var CartPrice = +thisData.find("#id"+id).find(".price").html().split(' ')[0];


        CartInput++;
        CartPrice=CartPrice+price;
        thisData.find("#id"+id).find("input").val(CartInput);
        thisData.find("#id"+id).find(".price").html(CartPrice+" грн");
        thisData.find("#id"+id).find(".price").attr("volumeForCart", CartInput*volumeForCart);
        thisData.find("#id"+id).find(".price").attr("weightForCart", CartInput*weightForCart);
       
        setDataInCart(thisData);
    };    
}   
   
function setDataInCart(thisData)    // Заполняем корзину данными
{
        var allTotalCart=[];
        var allVolumeForCart=[];
        var allWeightForCart=[];
    
    thisData.find(".price").each(function()
           {
               allTotalCart[allTotalCart.length] = $(this).html().split(' ')[0];  
               allVolumeForCart[allVolumeForCart.length]=$(this).attr("volumeForCart");
               allWeightForCart[allWeightForCart.length]=$(this).attr("weightForCart");
           });
        
        thisData.find(".priceToCart").html(_.sum(allTotalCart)+" грн");
        thisData.find(".volumeForCart").html(_.sum(allVolumeForCart)+" м3 объем");
        thisData.find(".weightForCart").html(_.sum(allWeightForCart)+" кг вес");
        
        thisData.find(".deliveryForCart").html(_.sum(allWeightForCart) < 10?"5 грн доставка":_.sum(allWeightForCart) < 50 ? "10 грн доставка" : _.sum(allWeightForCart) < 100?"20 грн доставка":"20 грн доставка")
        thisData.find(".deliveryForCart").html(_.sum(allVolumeForCart) > 50?"50 грн доставка":thisData.find(".deliveryForCart").html());
}
   
             
function buildButtonForView()   // Кнопки варианта отображения данных, панель сортировки по любому полю товара, фильтрация по бренду 
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
    
    var divButton1 = $("<div>").addClass("col-lg-3 col-md-3 col-sm-3").css({"margin-top":"10px"})  
            .append(divForView1);  
    var divButton2 = $("<div>").addClass("col-lg-3 col-md-3 col-sm-3")
            .append(selectForSort);       
    
    var divForView2 = $("<div>").addClass("btn-group-xs").css({"margin-bottom":"10px","margin-top":"10px"})  
            .append(butonSortDown)
            .append(butonSortUp);
    
    var divButton3 = $("<div>").addClass("col-lg-2 col-md-3 col-sm-3").css({"margin-left":"-40px"})  
            .append(divForView2);  
    
    var inputForBrand = $("<input>").attr("type","text").attr("placeholder","Бренд").addClass("form-control inputForBrand").css({"width":"100px","height":"35px"});
    var divForBrand = $("<div>").addClass("input-group").css({"display":"inline-block"})
            .append(inputForBrand);
    var labelForBrand = $("<label>").addClass("sr-only");
    var divForBrand2 = $("<div>").addClass("form-group")
            .append(labelForBrand)
            .append(divForBrand);
    
    var buttonForBrand = $("<button>").attr("type","text").addClass("btn btn-info btn-sm choiceForBrand").html("Выбрать");
    
    var formForBrand = $("<div>").addClass("form-inline")
            .append(divForBrand2)
            .append(buttonForBrand);
    
    var divButton4 = $("<div>").addClass("col-lg-3 col-md-3 col-sm-3").css({"margin-left":"-40px"}) 
            .append(formForBrand);    
    
     var divForButtonRow = $("<div>").addClass("row")
            .append(divButton1)
            .append(divButton2)
            .append(divButton3)
            .append(divButton4);
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
    var spanFooterVolume = $("<span>").addClass(".volumeForCart").attr("volumeForCart",volumeTile).html("Объем: "+volumeTile);
    var spanFooterWeight = $("<span>").addClass(".weightForCart").attr("weightForCart",weightTile).html("Вес: "+weightTile);
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

function ajax(dataThis)
{
    
    
 $.ajax
        ({
            type: "POST",
            url: dataThis.url,
            dataType:"json",
            data:{start:dataThis.start,count:dataThis.count,brand:dataThis.brand},           
            context: this 
        })         
        .done(function(a) 
        {        
          
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
                dataThis.dataFromAjax = a;                   
                if (dataThis.currentView == "Tile") 
                 buildDataByTile(dataThis,dataThis.cart); 
                if (dataThis.currentView == "Table") 
                 buildDataByTable(dataThis,dataThis.cart);
                if (dataThis.currentView == "List") 
                 buildDataByList(dataThis,dataThis.cart);
            
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
    }
})();