var a;
$(function()
    {
      /*  var opts =  // For round in waiting loads Ajax data
                {
                    lines: 15 // The number of lines to draw
                  , length: 27 // The length of each line
                  , width: 14 // The line thickness
                  , radius: 28 // The radius of the inner circle
                  , scale: 0.5 // Scales overall size of the spinner
                  , corners: 1 // Corner roundness (0..1)
                  , color: '#000' // #rgb or #rrggbb or array of colors
                  , opacity: 0.05 // Opacity of the lines
                  , rotate: 53 // The rotation offset
                  , direction: 1 // 1: clockwise, -1: counterclockwise
                  , speed: 0.7 // Rounds per second
                  , trail: 66 // Afterglow percentage
                  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                  , zIndex: 2e9 // The z-index (defaults to 2000000000)
                  , className: 'spinner' // The CSS class to assign to the spinner
                  , top: '50%' // Top position relative to parent
                  , left: '50%' // Left position relative to parent
                  , shadow: true // Whether to render a shadow
                  , hwaccel: true // Whether to use hardware acceleration
                  , position: 'absolute' // Element positioning
                };
        var target = $('.left-bg');
        var spinner = new Spinner(opts).spin(target.get(0));
        target.get(0).appendChild(spinner.el);
        $('body *').css("opacity",'0.5');
        $(".spinner *, .spinner").css("opacity",'1');*/
        
        $.post("admin.php","","","json")  //Ajax
            .done(function(a) 
            { 
               // spinner.stop();
                $('body *').css('opacity','1');
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
                    $(".getImg").attr("src",a[0].IMG);     
                    for (var i=0; i < itemLength && (i<a.length); i++) // Build Buttons of a items
                    {
                        $(".button").append($("<a>")
                            .addClass("circleButton").data("item",i)
                            .css({"display":"inline-block","margin-left":"5px","margin-top":"5px"})
                            .html(a[i].ID));
                    };
                    $(".brand").html(a[0].BRAND) // Build DATA of a First items (onload page)
                        .css({"font-weight":"bold", 'font-size':'1em', 'color':"black"});
                    $(".name").html(a[0].NAME)
                        .css({"font-weight":"bold", 'font-size':'2em', 'color':"black", 'margin-top':"20px"});
                    $(".price").html(a[0].PRICE+" грн.")
                        .css({"font-weight":"bold",'font-size':'1em', 'color':"magenta", 'margin-top':"7px"});
                    $("#home").html(a[0].DESCRIPTION)
                        .css({"min-height":'150px', 'color':"black", 'margin-top':"20px"});
                
                $(".circleButton").on("click",function() 
                {
                    $('.circleButton').removeClass('buttonActive');
                    var choose = $(this).data("item");
                    $(".getImg").attr("src",a[choose].IMG); 
                    $(this).addClass('buttonActive');
                    $(".getImg").on('error', function() // Check on errors of a load image;
                    {
                        $('.getImg').attr("src",'img/no_image.gif');
                    });
                    $('.circleButton').css({'background-color':'white',"color":"black"});
                    $(this).css({'background-color':'magenta',"color":'white'});
                                                        // Build Data items when click
                    $(".brand").html(a[choose].BRAND);
                    $(".name").html(a[choose].NAME);
                    $(".price").html(a[choose].PRICE+" грн.");
                    $("#home").html(a[choose].DESCRIPTION);
                });                                   
            };
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
    });
    