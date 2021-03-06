/*global define, TWEEN, _log, $ d3*/

define(['graphicalweb/events/UserEvent',
        'graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/CharCss'],

	function (UserEvent, StateEvent, Camera, Audio, VarsModel, Scenery, Div, CSS) {
		
		var Section2_CSS = function () {
			var instance = this,
                stateId = 2,
                css,
                delta = 0,
                hearts = [],
                $blockquotes,
                $cover,
                view;
            
            instance.talkingpoints = 0;
            instance.talkingpoint = 0;
            instance.phaselength = 0;
            instance.phase = 0;

//private
            function update() {
                var i, 
                    heart, 
                    newY,
                    newX,
                    speed,
                    scale;

                delta += 0.1;

                for (i = 0; i < hearts.length; i += 1) {
                    heart = hearts[i];
                    speed = parseFloat(heart.attr('data-speed'));
                    newY = parseFloat(heart.attr('data-y')) - speed;
                    newX =  parseFloat(heart.attr('data-x')) + Math.cos(delta * speed) * 10;
                    scale = parseFloat(heart.attr('data-scale'));
                    if (newY < 100) {
                        if (scale > 0) {
                            scale -= 0.01;
                        }
                    } else {
                        scale = scale < 0.5 ? scale + 0.01 : scale;
                    }
                    heart.attr('transform', 'translate(' + newX + ' ' + newY + ') scale(' + scale + ' ' + scale + ')');
                    heart.attr('data-y', newY);
                    heart.attr('data-scale', scale);
                    if (scale === 0) {
                        heart.remove();
                        hearts.splice(i, 1);
                    }
                }
            }

            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                Div.setFace('interested');
                
                css.start();
                addHearts();

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                }
            }

            function addHearts() {
                var svg, 
                    i,
                    heartX,
                    heartY,
                    heart, 
                    scale;
                
                svg = d3.select("#layer1").append("svg");
                svg.attr("width", 200).attr("height", 800);
                svg.attr("id", "heartHolder");
 
                for (i = 0; i < 5; i += 1) {
                    scale = Math.random() * 0.5;
                    heartX = 20 + Math.random() * 80;
                    heartY = 300 + Math.random() * 100;

                    heart = svg.append('path');
                    heart.attr('d', 'M41.251,12.335c0.05-6.086-4.84-11.061-10.926-11.112c-3.746-0.031-7.066,1.811-9.081,4.649c-1.967-2.871-5.257-4.77-9.002-4.801C6.155,1.02,1.291,5.914,1.239,11.998c-0.083,9.908,17.545,23.539,19.853,25.179l-0.003,0.161c0,0-0.069-0.029,0-0.08c0.07,0.052,0,0.08,0,0.08l0.003-0.161C23.424,35.576,41.168,22.241,41.251,12.335z');
                    heart.attr('fill', '#FF1F1F');
                    heart.attr('transform', 'translate(' + heartX + ' ' + heartY + ') scale(' + scale + ' ' + scale + ')');
                    heart.attr('data-x', heartX);
                    heart.attr('data-y', heartY);
                    heart.attr('data-speed', 0.2 + Math.random() * 0.2);
                    heart.attr('data-scale', scale);
                    hearts.push(heart);
                }
            }
            
//public
            instance.init = function (direct) {
                
                view = '.section2';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length + 1;

                css = new CSS('#charCSS');

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
                update();
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -1740, y: -768, z: 0},
                    divPosition = {x: 1700, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(-100);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(3000);
                    Camera.animatePosition(goalPosition, 3000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-100, 3000);

                    Div.animatePosition(divPosition, 2000);
                    Div.animateRotation(divRotation, 200);
                }
            };

            instance.run = function () {

                //var $currentQuote = $($blockquotes[instance.phase - 1]);
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                case 1:
                    //hubba hubba
                    StateEvent.AUTOMATING.dispatch();
                    
                    css.talk(false);
                    Div.setFace('talk');                   
                    Audio.playDialogue($($blockquotes[0]).data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 2:
                    //welcome to 1996
                    css.talk(true);
                    Div.setFace('happy');                   
                    Audio.playDialogue($($blockquotes[1]).data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });

                    break;
                case 3:
                    //about css
                    Div.setFace('happy');                   
                    Audio.playDialogue($($blockquotes[2]).data('audio'), function () {
                        css.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    Div.setFace('happy');                   
                    css.talk(false);
                    StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    break;
                case 5:
                    //made me better
                    StateEvent.AUTOMATING.dispatch();
                    css.talk(false);
                    Div.setFace('talk');                   
                    Audio.playDialogue($($blockquotes[3]).data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');                   
                    });
                    break;
                case 6:
                    //looking for svg
                    css.talk(true);
                    Div.setFace('happy');
                    Audio.playDialogue($($blockquotes[4]).data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 7:
                    //out of system
                    css.talk(true);
                    Div.setFace('happy');                   
                    Audio.playDialogue($($blockquotes[5]).data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        css.talk(false);
                    });
                    break;
                }
            };

            instance.prev = function () {
                instance.phase -= 1;
                instance.run();
            };

            instance.next = function () {
                instance.phase += 1;
                instance.run();
            };

            //instance.talkingPoint = function () {
            //    var array = TALKING_POINTS[stateId - 2];
            //    runTalkPoint(array, instance);
            //};

            instance.stop = function () {
                Audio.stopDialogue();
                css.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                $('#heartHolder').remove();
                hearts = [];
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section2_CSS();
    });
