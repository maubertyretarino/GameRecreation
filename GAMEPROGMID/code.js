// create Phaser.Game object named "game"
var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'my-game',
    { preload: preload, create: create, update: update });

// declare global variables for game
var player;
var arrowKey;
var sky, mountains, city;
var platformGroup;
var wallGroup;
var coinGroup;
var score=0;
var scoreText;
var catGroup;
var healthBar;
var catSound;
var endGroup;

// preload game assets - runs once at start
function preload() 
{
    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);

    game.load.spritesheet('coin', 'assets/images/coin.png', 32, 32);

    game.load.spritesheet('cat', 'assets/images/cat.png', 32, 32);
    game.load.image('endline', 'assets/images/pumpkin.png', 34, 32);

    game.load.audio('cat-sound', 'assets/sounds/meow-wav');

    game.load.image('sky', 'assets/images/sky-clouds.jpg');
    game.load.image('mountains', 'assets/images/mountain-skyline.png');
    game.load.image('city', 'assets/images/city-skyline.png');

    game.load.image('platform-50', 'assets/images/platform-050w.png');
    game.load.image('platform-100', 'assets/images/platform-100w.png');
    game.load.image('platform-200', 'assets/images/platform-200w.png');
    game.load.image('platform-300', 'assets/images/platform-300w.png');
    game.load.image('platform-400', 'assets/images/platform-400w.png');
    game.load.image('platform-500', 'assets/images/platform-500w.png');

    game.load.image('wall-50', 'assets/images/wall-050h.png');
    game.load.image('wall-150', 'assets/images/wall-150h.png');
    game.load.image('wall-250', 'assets/images/wall-250h.png');

    game.load.image('red-bar', 'assets/images/bar-red.png');
    game.load.image('green-bar', 'assets/images/bar-green.png');
    game.load.image('bar-outline', 'assets/images/bar-outline.png');

    
    
}

// create game world - runs once after "preload" finished
function create() 
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.up = false;

    game.world.setBounds(0, 0, 3000, 600);
    
    sky = game.add.tileSprite(0, 0, 1000, 600, 'sky');
    mountains = game.add.tileSprite(0, 0, 1000, 600, 'mountains');
    city = game.add.tileSprite(0, 0, 1000, 600, 'city');
    
    // PLATFORMS
    platformGroup = game.add.group();
    platformGroup.enableBody = true;

    platformGroup.create(200, 500, 'platform-100');
    platformGroup.create(400, 425, 'platform-100');
    platformGroup.create(600, 350, 'platform-100');
    platformGroup.create(50, 100, 'platform-50');
    platformGroup.create(250, 175, 'platform-100');
    platformGroup.create(450, 260, 'platform-100');
    platformGroup.create(900, 275, 'platform-200');
    platformGroup.create(1150, 475, 'platform-50');
    platformGroup.create(1350, 500, 'platform-50');
    platformGroup.create(1400, 425, 'platform-100');
    platformGroup.create(1500, 350, 'platform-100');
    platformGroup.create(1650, 250, 'platform-50');
    platformGroup.create(1950, 175, 'platform-100');
    platformGroup.create(1800, 250, 'platform-50');
    platformGroup.create(2800, 275, 'platform-200');
    platformGroup.create(2150, 475, 'platform-50');
    platformGroup.create(2350, 500, 'platform-50');
    platformGroup.create(2400, 425, 'platform-100');
    platformGroup.create(2500, 350, 'platform-100');

    // add ground platform
    var ground = platformGroup.create(0, game.world.height - 25, 'platform-500');
    ground.scale.setTo(10, 1); // 10 * 500 = 5000 pixels wide

    platformGroup.setAll('body.immovable', true);

    player = game.add.sprite(25, 300, 'dude');

    //wall group
    wallGroup = game.add.group();
    wallGroup.enableBody = true;

    wallGroup.create(525, 525, 'wall-50');
    wallGroup.create(1000, 425, 'wall-150');
    wallGroup.create(2000, 525, 'wall-50');
    wallGroup.create(3000, 525, 'wall-50');

    wallGroup.setAll('body.immovable', true);

    //coingroup
    coinGroup=game.add.group();
    coinGroup.enableBody=true;

    var coinData = [
        { x:75, y:0 },
        { x:150, y:0 },
        { x:250, y:250 },
        { x:275, y:0 },
        { x:350, y:0 },
        { x:450, y:300 },
        { x:475, y:0 },
        { x:537, y:0 },
        { x:650, y:0 },
        { x:700, y:400 },
        { x:850, y:0 },
        { x:950, y:0 },
        { x:1050, y:0 },
        { x:1175, y:0 },
        { x:1375, y:0 },
        { x:1450, y:300 },
        { x:1475, y:0 },
        { x:1537, y:0 },
        { x:1650, y:0 },
        { x:1700, y:400 },
        { x:1850, y:0 },
        { x:1950, y:0 },
        { x:2150, y:0 },
        { x:2250, y:250 },
        { x:2275, y:0 },
        { x:2350, y:0 },
        { x:2450, y:300 },
        { x:2475, y:0 },
        { x:2537, y:0 },
        { x:2650, y:0 }
        
        // no comma after last item in array
    ];

    for (var i = 0; i < coinData.length; i++) {
        var coin = coinGroup.create(coinData[i].x, coinData[i].y, 'coin');
        coin.anchor.set(0.5, 0.5);
        coin.body.gravity.y = 400;
        coin.body.bounce.y = 0.5;
        coin.animations.add('spin', [0,1,2,3,4,5], 10, true);
        coin.animations.play('spin');
    }
    
    //catgroup
    catGroup = game.add.group();
    catGroup.enableBody = true;
    for (var i = 0; i < 25; i++) {
        var cat = catGroup.create(i * 200 + 100, 0, 'cat');
        cat.anchor.set(0.5, 0.5);
        cat.body.gravity.y = 300;
        cat.body.bounce.y = 0.1;
        cat.body.collideWorldBounds = true;
        cat.animations.add('left', [0,1], 10, true);
        cat.animations.add('left', [2,3], 10, true);
        cat.body.velocity.x = Math.random() * 50 + 100; // between 100-150
        if (Math.random() < 0.5) cat.body.velocity.x *= -1; // reverse direction

    }

    /*endGroup = game.add.sprite(25, 300, 'endline');
    endGroup.anchor.set(0.5, 0.5);
    endGroup.body.gravity.y = 450;
    endGroup.body.collideWorldBounds = true;
    endGroup.body.bounce.y = 0.3;
    */


    //fixes background to player camera
    sky.fixedToCamera = true;
    mountains.fixedToCamera = true;
    city.fixedToCamera = true;

    player.health=100;
    player.maxhealth=100;
    
    player.events.onKilled.add(function() {
        player.reset(25, 300, 100);
    });

    game.camera.follow(player);//camera follows player

    game.physics.arcade.enable(player);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.anchor.set(0.5, 0.5);
    player.body.gravity.y = 450;
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0.3;

    
    arrowKey = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(20, 20, 'Score: '+ score, { fontSize: '20px', fill: '#222222' });
    scoreText.fixedToCamera=true;

    var healthText = this.add.text(325, 20, 'Health', { fontSize: '20px', fill: '#222222' });
    healthText.fixedToCamera=true;
    
    var barBackground, barOutline;
    
    barBackground=game.add.image(400, 20, 'red-bar');
    barBackground.fixedToCamera=true;

    healthBar=game.add.image(400, 20, 'green-bar');
    healthBar.fixedToCamera=true;
    
    barOutline=game.add.image(400, 20, 'bar-outline');
    barOutline.fixedToCamera=true;


    game.add.text(1000, 300, '1000px', { fill: 'white' });    
    game.add.text(2000, 300, '2000px', { fill: 'white' });    
    game.add.text(3000, 300, '3000px', { fill: 'white' });    
    game.add.text(4000, 300, '4000px', { fill: 'white' });

    
}

// update gameplay - runs in continuous loop after "create" finished
function update() {
    
    //player collision for platforms and walls
    game.physics.arcade.collide(player, platformGroup);
    game.physics.arcade.collide(player, wallGroup);

    //coin collision for platforms and walls
    game.physics.arcade.collide(coinGroup,platformGroup);
    game.physics.arcade.collide(coinGroup,wallGroup);

    game.physics.arcade.collide(player, coinGroup, collectCoin, null, this);

    //collision catgroup
    game.physics.arcade.collide(catGroup,platformGroup, patrolPlatform, null, this);
    game.physics.arcade.collide(catGroup,wallGroup);

    game.physics.arcade.overlap(player,catGroup, touchCat, null, this);

    game.physics.arcade.collide(player,endGroup);

    if (arrowKey.right.isDown) {
        
        player.body.velocity.x = 200;
        player.animations.play('right');
    }
    else if (arrowKey.left.isDown) {
        
        player.body.velocity.x = -200;
        player.animations.play('left');
    }
    else {
        
        player.body.velocity.x = 0;
        player.animations.stop();
        player.frame = 4;
    }

    if (arrowKey.up.justDown && player.body.touching.down) {

        player.body.velocity.y = -300;
    }
    
    // BACKGROUND PARALLAX    
    sky.tilePosition.x = game.camera.x * -0.2;
    mountains.tilePosition.x = game.camera.x * -0.4;
    city.tilePosition.x = game.camera.x * -0.6;    
    
    // CHECK CAT ANIMATIONS
    catGroup.forEach(function (cat) {
    if (cat.body.velocity.x < 0) cat.animations.play('left');
        else cat.animations.play('right');
    });
}

function collectCoin(player, coin) {
    coin.kill();
    score += 10;
    scoreText.setText('Score: ' + score);

}

function patrolPlatform(enemy, platform) {
    // if enemy about to go over right or left edge of platform
    if (enemy.body.velocity.x > 0 && enemy.right > platform.right
    || enemy.body.velocity.x < 0 && enemy.left < platform.left) {
        enemy.body.velocity.x *= -1; // reverse direction
    }
}
function touchCat(player, cat) {
    cat.body.velocity.x *= -1;
    cat.body.velocity.y = -150;
    if (player.x < cat.x) cat.x += 20;
    else cat.x -= 20;
    game.catSound.play();
    player.damage(25);
    healthBar.scale.setTo(player.health / player.maxHealth, 1);
}

// add custom functions (for collisions, etc.)