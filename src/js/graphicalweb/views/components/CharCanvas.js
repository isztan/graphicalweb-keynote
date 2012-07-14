define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/utils/ParticleSystem'],

	function (CSS3Helper, ParticleSystem) {

		//THIS IS BASICALLY A PARTICLE MACHINE
		var CharCanvas = function () {
			var instance = this,
                $canvas,
                canvas,
                ctx,
                p,
                system,
                _width = window.innerWidth,
                _height = window.innerHeight;

            instance.visible = false;
//private

            /**
             * processing
             */
            function process(c) {
                var pixels,
                    i;
                
                c.setup = function () {
                    c.size(_width, _height);
                    c.noStroke();
                    c.frameRate(60);
                    c.fill(0, 0, 0);
                };

                c.mouseMoved = function () {
                    system.mx = c.mouseX;
                    system.my = c.mouseY;
                };

                c.draw = function () {	
                    system.update();
                    pixels = system.pixels;

                    c.background(0, 0);

					for (i = 0; i < pixels.length; i += 1) {
						c.fill(Math.floor(pixels[i].r), Math.floor(pixels[i].g), Math.floor(pixels[i].b));
						c.ellipse(pixels[i].x, pixels[i].y, pixels[i].size, pixels[i].size);
					}
				};
            }

//public
			instance.init = function () {
                $canvas = $('#charCanvas');
                canvas = $canvas[0];
                ctx = $canvas[0].getContext('2d');
                system = new ParticleSystem();

                instance.show();
            };

            instance.show = function () {
                if (instance.visible === false) {
                    $canvas.show();
                    instance.visible = true;
                }
            };

            instance.hide = function () {
                if (instance.visible === true) {
                    $canvas.hide(instance.destroy);
                    instance.visible = false;
                }
            };

            instance.stop = function () {
                p.exit();
            };

            instance.stars = function () {
                p = new Processing(canvas, process);
            };

            instance.drawFace = function () {
                //TODO:: particles draw face
            };

            instance.destroy = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            };

		};

		return new CharCanvas();
    });
