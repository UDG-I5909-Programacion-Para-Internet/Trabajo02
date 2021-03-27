var config = {
    type: Phaser.AUTO,
    width: 1200,
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
var stars;
var bombs;
var platform;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game = new Phaser.Game(config);


    function preload ()
    {
        this.load.image('space', 'assets/asteroidfield.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/cristal.png');
        this.load.image('bomb', 'assets/asteroid.png');
        this.load.spritesheet('dude', 'assets/astro.png', { frameWidth: 32, frameHeight: 62});
    }

    function create ()
    {
        this.add.image(600, 450, 'space').setScale(2.5);

        platforms = this.physics.add.staticGroup();
        platforms.create(350, 868, 'ground').setScale(1.5).refreshBody();

        platforms.create(1000, 800, 'ground');
        platforms.create(50, 650, 'ground');
        platforms.create(750, 620, 'ground');

        player = this.physics.add.sprite(200, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { frames: [0, 2, 1] }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 3 } ],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {frames: [4, 6, 5]}),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();

        stars = this.physics.add.group({
            key: 'star',
            repeat: 16,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

        });

        bombs = this.physics.add.group();
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFFFF' });


        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    function update ()
    {
        if (gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

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

        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
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