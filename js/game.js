var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var crystal;
var asteroid;
var platform;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game = new Phaser.Game(config);


    function preload ()
    {
        this.load.image('space', 'assets/asteroidfield.png');
        this.load.image('platL', 'assets/platL.png');
        this.load.image('platM', 'assets/platM.png');
        this.load.image('platR', 'assets/platR.png');
        this.load.image('box', 'assets/Box.png');
        this.load.image('crystal', 'assets/crystal.png');
        this.load.image('bomb', 'assets/asteroid.png');
        this.load.image('bomb', 'assets/asteroid.png');
        this.load.spritesheet('dude', 'assets/astro.png', { frameWidth: 32, frameHeight: 62});
    }

    function create ()
    {
        this.add.image(600, 450, 'space').setScale(2.5);

        platforms = this.physics.add.staticGroup();
        
        // top
        platforms.create(64, 318, 'platR');
        platforms.create(1216, 318, 'platL');

        // row 3
        platforms.create(192, 468, 'box');
        platforms.create(1088, 468, 'box');

        // row 2
        platforms.create(448, 568, 'platL');
        platforms.create(576, 568, 'platM');
        platforms.create(704, 568, 'platM');
        platforms.create(832, 568, 'platR');


        // row 1
        platforms.create(64, 718, 'platM');
        platforms.create(192, 718, 'platR');
        platforms.create(1088, 718, 'platL');
        platforms.create(1216, 718, 'platM');
        
        //bottom
        platforms.create(64, 868, 'platL');
        platforms.create(192, 868, 'platM');
        platforms.create(320, 868, 'platM');
        platforms.create(192, 868, 'platM');
        platforms.create(448, 868, 'platM');
        platforms.create(576, 868, 'platM');
        platforms.create(704, 868, 'platM');
        platforms.create(832, 868, 'platM');
        platforms.create(960, 868, 'platM');
        platforms.create(1088, 868, 'platM');
        platforms.create(1216, 868, 'platR');
        //platforms.create(350, 868, 'platform').setScale(1.5).refreshBody();
        //platforms.create(1000, 800, 'platform');
        //platforms.create(50, 650, 'platform');
        //platforms.create(750, 620, 'platform');

        player = this.physics.add.sprite(200, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { frames: [0, 2, 1] }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 3 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {frames: [4, 6, 5]}),
            frameRate: 20,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();

        crystal = this.physics.add.group({
            key: 'crystal',
            repeat: 18,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        crystal.children.iterate(function (child) {

        });

        asteroid = this.physics.add.group();
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFFFF' });


        this.physics.add.collider(player, platforms);
        this.physics.add.collider(crystal, platforms);
        this.physics.add.collider(asteroid, platforms);
        this.physics.add.overlap(player, crystal, collectStar, null, this);
        this.physics.add.collider(player, asteroid, hitBomb, null, this);
    }

    function update ()
    {
        if (gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            player.setVelocityX(-220);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(220);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }

    function collectStar (player, star)
    {
        star.disableBody(true,true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (crystal.countActive(true) === 0)
        {
            crystal.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = asteroid.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }

    }

    function hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }