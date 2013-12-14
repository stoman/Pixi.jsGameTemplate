// global variables
var canvas;
var renderer;
var stage;
var game;

// user input
var keysPressed = [];
var mouseDown = false;

// preloader
$(document).ready(
        function() {
            // load assets
            var loader = test = new PIXI.AssetLoader([
                "img/pixi.js.png"
            
            // @TODO add assets
            
            ]);
            loader.addEventListener("onComplete", function(event) {
                // finished -> start game
                var time = 2000;
                $("#loading").fadeOut(time, function() {
                    $("#game-canvas").fadeIn(time);
                    playBackgroundMusic();
                });
            });
            
            // loading progress
            var loadCount = 0;
            loader.addEventListener("onProgress", function(event) {
                $("#loading p").html(
                        Math.round(100 * ++loadCount / loader.assetURLs.length)
                                + "%");
            });
            
            // start loading
            loader.load();
            $("#js-error").hide();
            $("#loading").show();
        });

function setup() {
    // setup renderer and stage
    canvas = $("#game-canvas");
    renderer = new PIXI.autoDetectRenderer(canvas.width(), canvas.height(),
            canvas[0]);
    
    // handle keyboard input
    document.onkeydown = function(event) {
        keysPressed.push(event.keyCode);
        return false;
    };
    document.onkeyup = function(event) {
        while (-1 < keysPressed.indexOf(event.keyCode)) {
            keysPressed.splice(keysPressed.indexOf(event.keyCode), 1);
        }
        return false;
    };
    
    // handle mouse input
    canvas[0].onmousedown = function() {
        mouseDown = true;
    };
    canvas[0].onmouseup = function() {
        mouseDown = false;
    };
}

/**
 * This function runs the game. It creates the renderer, the stage, the sprites
 * and so on.
 */
function initialize() {
    // game data
    game = {
        speed : 1,
        sprites : []
    // @TODO add attributes
    };
    
    // setup renderer and stage
    stage = new PIXI.Stage(0x66FF99);
    
    // @TODO add children
    
    // animate
    requestAnimFrame(animate);
}

/**
 * This function is called in every tick of the game, usually 30 times per
 * second. All position updates and so on go here.
 */
function animate() {
    
    // @TODO add code
    
    // update sprites
    for ( var i = 0; i < game.sprites.length; i++) {
        // compute new attributes
        // position
        game.sprites[i].position.x += game.speed * game.sprites[i].speed.x;
        game.sprites[i].position.y += game.speed * game.sprites[i].speed.y;
        // size
        if (game.sprites[i].growing) {
            game.sprites[i].size += game.speed
                    * Math.sqrt(game.sprites[i].speed.x
                            * game.sprites[i].speed.x + game.sprites[i].speed.y
                            * game.sprites[i].speed.y) / 10;
        }
        // set sprite attributes
        // position
        game.sprites[i].sprite.position.x = game.sprites[i].position.x;
        game.sprites[i].sprite.position.y = game.sprites[i].position.y;
        // rotation
        game.sprites[i].sprite.rotation = Math.atan2(game.sprites[i].speed.y,
                game.sprites[i].speed.x);
        // scale
        if ('size' in game.sprites[i]) {
            game.sprites[i].sprite.scale.x = game.sprites[i].size
                    / game.sprites[i].sprite.texture.width;
            game.sprites[i].sprite.scale.y = game.sprites[i].size
                    / game.sprites[i].sprite.texture.width;
        }
    }
    
    // render
    renderer.render(stage);
    
    requestAnimFrame(animate);
}

// sound
var sound = {
    background : undefined
};
var muted = false;

// @TODO load sound like sound.background = new Audio("audio/rich-vines.wav");

/**
 * This function initializes the background music and plays it if it is not
 * muted. Otherwise, the music is paused.
 */
function playBackgroundMusic() {
    // check for setup
    if (sound.background == undefined) {
        return;
    }
    
    // setup sound.background
    sound.background.loop = true;
    
    // play or pause
    if (muted) {
        sound.background.pause();
    }
    else {
        sound.background.play();
    }
}

/**
 * This function mutes the background music and stops the replay.
 */
function mute() {
    muted = true;
    $('#mute').html('Unmute').addClass('muted').removeClass('mute');
    playBackgroundMusic();
}

/**
 * This function unmutes the background music and restart the replay.
 */
function unmute() {
    muted = false;
    $('#mute').html('Mute').addClass('mute').removeClass('muted');
    playBackgroundMusic();
}

/**
 * This function toggles the background music and therefore mutes respectively
 * unmutes it.
 */
function toggleMute() {
    if (muted) {
        unmute();
    }
    else {
        mute();
    }
}

/**
 * This function computes the directory of the game's main html file. Prepend
 * this to paths to remove relative paths.
 * 
 * @returns the main html file's directory
 */
function getBasePath() {
    var pathname = window.location.pathname;
    var directory;
    if (pathname.indexOf('/') == -1) {
        if (pathname.indexOf('.') == -1) {
            // directory at top level
            directory = pathname + '/';
        }
        else {
            // file at top level
            directory = '/';
        }
    }
    else {
        if (pathname.lastIndexOf('.') < pathname.lastIndexOf('/')) {
            // directory at nested level
            directory = pathname
                    + (pathname.lastIndexOf('/') == pathname.length - 1 ? ''
                            : '/');
        }
        else {
            // file at nested level
            directory = pathname.substring(0, pathname.lastIndexOf('/') + 1);
        }
    }
    return window.location.origin + directory;
}