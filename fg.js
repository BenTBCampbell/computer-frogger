/**
 * LINES:
 * WON  
 * 6        0
 * 5        30
 * 4        100
 * REST     170
 * 3        220
 * 2        260
 * 1        330
 * START    440
 */

$(function() {
    var backgroundAnim = new gf.animation({
        url : "images/back.png"
    });
    var networkPacketsAnim = new gf.animation({
        url : "images/packet.png"
    });
    var bugsAnim = new gf.animation({
        url : "images/bug.png"
    });
    var playerAnim = new gf.animation({
        url : "images/player.png"
    });
    var keys = {
        up:false,
        left:false,
        right:false
    }

    var initialize = function() {
        $("#mygame").append("<div id='container' style='display: none; width: 640px; height: 480px;'>");
        gf.addSprite("container","background",{width: 640, height: 480, y: 0, x: 0});
        gf.addSprite("container","packets1",{width: 640, height: 40, y: 400, x: 0});
        gf.addSprite("container","packets2",{width: 640, height: 40, y: 330, x: 0});
        gf.addSprite("container","packets3",{width: 640, height: 40, y: 260, x: 0});
        gf.addSprite("container","bugs1",{width: 640, height: 60, y: 170, x: 0});
        gf.addSprite("container","bugs2",{width: 640, height: 60, y: 100, x: 0});
        gf.addSprite("container","bugs3",{width: 640, height: 60, y: 30, x: 0});
        gf.addSprite("container","player",{width: 40, height: 40, y: 440, x: 300});

        gf.setAnimation("background", backgroundAnim);
        gf.setAnimation("player", playerAnim);
        gf.setAnimation("packets1", networkPacketsAnim);
        gf.setAnimation("packets2", networkPacketsAnim);
        gf.setAnimation("packets3", networkPacketsAnim);
        gf.setAnimation("bugs1", bugsAnim);
        gf.setAnimation("bugs2", bugsAnim);
        gf.setAnimation("bugs3", bugsAnim);
        
        $("#startButton").remove();
        $("#container").append("<div id='lifes' style='position: relative; color: #FFF;'>life: 3</div>").css("display", "block");
        setInterval(gameLoop, 100);
        gf.autoScaleToWindow($("#mygame"));
    };
    
    var screenWidth = 640;
    var packets1 = {
        position: 300,
        speed: 3
    };
    var packets2 = {
        position: 0,
        speed: -5
    };
    var packets3 = {
        position: 30,
        speed: 10
    };
    var bugs1 = {
        position: 100,
        speed: -7
    };
    var bugs2 = {
        position: 0,
        speed: 6
    };
    var bugs3 = {
        position: 50,
        speed: -10
    };
    
    var gameState = "START";
    
    var gameLoop = function() {
        packets1.position += packets1.speed;
        $("#packets1").css("background-position",""+ packets1.position +"px 0px");
        
        packets2.position += packets2.speed;
        $("#packets2").css("background-position",""+ packets2.position +"px 0px");
        
        packets3.position += packets3.speed;
        $("#packets3").css("background-position",""+ packets3.position +"px 0px");
        
        bugs1.position += bugs1.speed;
        $("#bugs1").css("background-position",""+ bugs1.position +"px 0px");
        bugs2.position += bugs2.speed;
        $("#bugs2").css("background-position",""+ bugs2.position +"px 0px");
        bugs3.position += bugs3.speed;
        $("#bugs3").css("background-position",""+ bugs3.position +"px 0px");
    
        var newPos = gf.x("player");
        switch(gameState){
            case "LINE1":
                newPos += packets1.speed;
                break;
            case "LINE2":
                newPos += packets2.speed;
                break;
            case "LINE3":
                newPos += packets3.speed;
                break;
        }
        if(gameState !== "WON" && gameState !== "GAMEOVER"){
            if(keys.left){
                newPos -= 5;
            }
            if(keys.right){
                newPos += 5;
            }
            if(newPos > screenWidth || newPos < -40){
                    kill();
            } else {
                if(!detectSafe(gameState)){
                    kill();
                }
                gf.x("player", newPos);
            }

            if( !$("#player").is(':animated') && keys.up) {
                console.log("moving up")
                switch(gameState){
                    case "START":
                        $("#player").animate({top: 400},function(){
                            if(detectSafe("LINE1")){
                                gameState = "LINE1";
                            } else {
                                kill();
                            }
                        });
                        break;
                    case "LINE1":
                        $("#player").animate({top: 330},function(){
                            if(detectSafe("LINE2")){
                                gameState = "LINE2";
                            } else {
                                kill();
                            }
                        });
                        break;
                    case "LINE2":
                        $("#player").animate({top: 260},function(){
                            if(detectSafe("LINE3")){
                                gameState = "LINE3";
                            } else {
                                kill();
                            }
                        });
                        break;
                    case "LINE3":
                        $("#player").animate({top: 220},function(){
                            gameState = "REST";
                        });
                        break;
                    case "REST":
                        $("#player").animate({top: 180},function(){
                            if(detectSafe("LINE4")){
                                gameState = "LINE4";
                            } else {
                                kill();
                            }
                        });
                        break;
                    case "LINE4":
                        $("#player").animate({top: 110},function(){
                            if(detectSafe("LINE5")){
                                gameState = "LINE5";
                            } else {
                                kill();
                            }
                        });
                        break;
                    case "LINE5":
                        $("#player").animate({top: 40},function(){
                            if(detectSafe("LINE6")){
                                gameState = "LINE6";
                            } else {
                                kill();
                            }
                        });
                        break;
                    case "LINE6":
                        $("#player").animate({top: 0},function(){
                            gameState = "WON";
                            $("#lifes").html("You won!");
                        });
                        break;
                }
            }
        }
    };
    /**
        $(document).keydown(function(e){
        if(gameState !== "WON" && gameState !== "GAMEOVER"){
            console.log("keydown:" + e.keyCode)
            switch(e.keyCode){
                case 38: // jump
                    switch(gameState){
                        case "START":
                            $("#player").animate({top: 400},function(){
                                if(detectSafe("LINE1")){
                                    gameState = "LINE1";
                                } else {
                                    kill();
                                }
                            });
                            break;
                        case "LINE1":
                            $("#player").animate({top: 330},function(){
                                if(detectSafe("LINE2")){
                                    gameState = "LINE2";
                                } else {
                                    kill();
                                }
                            });
                            break;
                        case "LINE2":
                            $("#player").animate({top: 260},function(){
                                if(detectSafe("LINE3")){
                                    gameState = "LINE3";
                                } else {
                                    kill();
                                }
                            });
                            break;
                        case "LINE3":
                            $("#player").animate({top: 220},function(){
                                gameState = "REST";
                            });
                            break;
                        case "REST":
                            $("#player").animate({top: 180},function(){
                                if(detectSafe("LINE4")){
                                    gameState = "LINE4";
                                } else {
                                    kill();
                                }
                            });
                            break;
                        case "LINE4":
                            $("#player").animate({top: 110},function(){
                                if(detectSafe("LINE5")){
                                    gameState = "LINE5";
                                } else {
                                    kill();
                                }
                            });
                            break;
                        case "LINE5":
                            $("#player").animate({top: 40},function(){
                                if(detectSafe("LINE6")){
                                    gameState = "LINE6";
                                } else {
                                    kill();
                                }
                            });
                            break;
                        case "LINE6":
                            $("#player").animate({top: 0},function(){
                                gameState = "WON";
                                $("#lifes").html("You won!");
                            });
                            break;
                    }
            }
        }
    });
    */
   $(document).keydown(function(e){
       if (e.key === "ArrowRight") { keys.right = true };
       if (e.key === "ArrowLeft") { keys.left = true };
       if (e.key === "ArrowUp") { keys.up = true };
   });
   $(document).keyup(function(e){
       if (e.key === "ArrowRight") { keys.right = false };
       if (e.key === "ArrowLeft") { keys.left = false };
       if (e.key === "ArrowUp") { keys.up = false };
   });
    var detectSafe = function(state){
        switch(state){
            case "LINE1":
                var relativePosition = (gf.x("player") - packets1.position) % 230;
                relativePosition = (relativePosition < 0) ? relativePosition + 230: relativePosition;
                if(relativePosition > 110 && relativePosition < 210) {
                    return true;
                } else {
                    return false;
                }
                break;
            case "LINE2":
                var relativePosition = (gf.x("player") - packets2.position) % 230;
                relativePosition = (relativePosition < 0) ? relativePosition + 230: relativePosition;
                if(relativePosition > 110 && relativePosition < 210) {
                    return true;
                } else {
                    return false;
                }
                break;
            case "LINE3":
                var relativePosition = (gf.x("player") - packets3.position) % 230;
                relativePosition = (relativePosition < 0) ? relativePosition + 230: relativePosition;
                if(relativePosition > 110 && relativePosition < 210) {
                    return true;
                } else {
                    return false;
                }
                break;
            case "LINE4":
                var relativePosition = (gf.x("player") - bugs1.position) % 190;
                relativePosition = (relativePosition < 0) ? relativePosition + 190: relativePosition;
                if(relativePosition < 130) {
                    return true;
                } else {
                    return false;
                }
                break;
            case "LINE5":
                var relativePosition = (gf.x("player") - bugs2.position) % 190;
                relativePosition = (relativePosition < 0) ? relativePosition + 190: relativePosition;
                if(relativePosition < 130) {
                    return true;
                } else {
                    return false;
                }
                break;
            case "LINE6":
                var relativePosition = (gf.x("player") - bugs3.position) % 190;
                relativePosition = (relativePosition < 0) ? relativePosition + 190: relativePosition;
                if(relativePosition < 130) {
                    return true;
                } else {
                    return false;
                }
                break;
        }
        return true;
    };
    var life = 3;
    var kill = function (){
        $("#player").stop(true).animate
        life--;
        if(life <= 0) {
            gameState = "GAMEOVER";
            $("#lifes").html("Game Over!");
            gf.x("player", 300);
                    gf.y("player", 440);
        } else {
            $("#lifes").html("life: "+life);
            switch(gameState){
                case "START":
                case "LINE1":
                case "LINE2":
                case "LINE3":
                    gf.x("player", 300);
                    gf.y("player", 440);
                    gameState = "START";
                    break;
                case "REST":
                case "LINE4":
                case "LINE5":
                case "LINE6":
                    gf.x("player", 300);
                    gf.y("player", 220);
                    gameState = "REST";
                    break;
            }
        }
    };
    
    $("#startButton").click(function() {
        gf.startPreloading(initialize);
    });
});