var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlumeting;

var game_score;
var flagpole;
var lives;
var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    jumpSound = loadSound('assets/jump.wav');
    victorySound = loadSound('assets/victorycelebration.wav');
    loserSound = loadSound('assets/ulose.mp3');
    deathSound = loadSound('assets/ouch.wav');
    coinSound = loadSound('assets/Coin.mp3');
    
    jumpSound.setVolume(0.1);
    victorySound.setVolume(0.1);
    loserSound.setVolume(0.1);
    deathSound.setVolume(0.1);
    coinSound.setVolume(0.1);
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
	scrollPos = 0;
	gameChar_world_x = gameChar_x - scrollPos;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlumeting = false;
    
    trees = [
        {xpos: 222, ypos: 432},
        {xpos: 700, ypos: 432},
        {xpos: 1388, ypos: 432},
        {xpos: 1752, ypos: 432},
        {xpos: 2124, ypos: 432},
        {xpos: 2600, ypos: 432}
    ]
    
    clouds = [
        {xpos: 122, size: 70, ypos: 145},
        {xpos: 700, size: 70, ypos: 160},
        {xpos: 1200, size: 70, ypos: 150},
        {xpos: 1660, size: 70, ypos: 150},
        {xpos: 2100, size: 70, ypos: 150},
        {xpos: 2400, size: 70, ypos: 150},
        {xpos: 2900, size: 70, ypos: 150}
    ]
    
    mountains = [
        {xpos: 100, width: 300, ypos: 432},
        {xpos: 1000, width: 300, ypos: 432},
        {xpos: 2100, width: 300, ypos: 432},
        {xpos: 3000, width: 300, ypos: 432}
    ]
    
    canyons = [
        {xpos: 650, ypos: 432, width: 80},
        {xpos: 1200, ypos: 432, width: 80},
        {xpos: 1400, ypos: 432, width: 80},
        {xpos: 1900, ypos: 432, width: 80},
        {xpos: 2300, ypos: 432, width: 80},
        {xpos: 2800, ypos: 432, width: 80}
    ]
    
    collectables = [
        {xpos: 900, ypos: 418, size:10, isFound: false},
        {xpos: 1117, ypos: 418, size:10, isFound: false},
        {xpos: 1717, ypos: 418, size:10, isFound: false},
        {xpos: 2217, ypos: 418, size:10, isFound: false},
        {xpos: 2517, ypos: 418, size:10, isFound: false}
    ];
    
    game_score = 0;
    
    flagpole = {
        xpos: 3500,
        isReached: false
    }
    
    if(lives < 4)
        {
            deathSound.play();
        }
    
    if(lives < 2)
        {
            loserSound.play();
        }
    lives -= 1;
}

function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 4;
    startGame();
}

function draw()
{
    background(222, 145, 73);
    noStroke();
	fill(82, 47, 23);
	rect(0, floorPos_y, width, height - floorPos_y);
    fill(255, 255, 0);
    arc(1000, 25, 250, 250, 0, PI + QUARTER_PI, OPEN);
	fill(0);
    
    push();
    translate(scrollPos,0);
    
    if(gameChar_y > 576 && lives > 0)
        {
            startGame();
        }
    
    drawClouds();
    drawMountains();
    drawTrees();
    
    for(var c = 0; c < canyons.length; c++)
    {
        drawCanyon(canyons[c]);
        checkCanyon(canyons[c]);
    }

    for(var z = 0; z < collectables.length; z++)
    {
        if(collectables[z].isFound == false)
        {
            drawCollectable(collectables[z]);
            checkCollectable(collectables[z]);   
        } 
    }

    renderFlagpole();
    pop();
	drawGameChar();
    
    fill(255);
    noStroke();
    textSize(20);
    textStyle(BOLD);
    text("Score: " + game_score, 30, 40);

    fill(255);
    noStroke();
    textSize(20);
    textStyle(BOLD);
    text("Lives: " + lives, 140, 40);
    
    if(lives < 1)
        {
            fill(255,0,0);
            noStroke();
            textSize(20);
            textStyle(BOLD);
            text("Game over. Press space to continue.", 400, 335);
            return
        }
    
    if(flagpole.isReached == true)
       {
            fill(0,255,0);
            noStroke();
            textSize(20);
            textStyle(BOLD);
            text("Level complete. Press space to continue.", 400, 335);
            return
       }

	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5;
		}
	}

    if(gameChar_y < floorPos_y)
        {
           gameChar_y += 4;
            isFalling = true;
    } else {
            isFalling = false;
        }
    
    if(isPlumeting)
        {
            gameChar_y += 6;
        }
    
    if(flagpole.isReached != true)
        {
            checkFlagpole();
        }
	gameChar_world_x = gameChar_x - scrollPos;
}

function returnToStart()
{
    lives = 4
    deathSound.stop();
    jumpSound.stop();
    victorySound.stop();
    loserSound.stop();
    coinSound.stop();
    startGame();
}

function nextLevel()
{
    lives = 4
    lives = lives - 2
    deathSound.stop();
    jumpSound.stop();
    victorySound.stop();
    loserSound.stop();
    coinSound.stop();
    startGame();
}


function keyPressed()
{
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }
    
    if(keyCode == 37)
    {
        isLeft = true;
    }
    
    if(keyCode == 39)
    {
        isRight = true;
    }
    
     if(keyCode == 32 && gameChar_y == floorPos_y)
    {
        gameChar_y -= 124;
        jumpSound.play();
    }
}

function keyReleased()
{
    if(keyCode == 37)
    {
        isLeft = false;
    }
    
    if(keyCode == 39)
    {
        isRight = false;
    }
}

function drawGameChar()
{
        if(isLeft && isFalling)
        {
            strokeWeight(1);
            stroke(0);
            strokeWeight(7);
            line((gameChar_x), (gameChar_y - 17), (gameChar_x - 20), (gameChar_y - 20));
            strokeWeight(1);
            fill(0);
            rect((gameChar_x - 24), (gameChar_y - 29), 7, 12, 20);
            fill(0,191,255);
            ellipse(gameChar_x, (gameChar_y - 35), 20, 40);
            fill(255,192,203);
            ellipse(gameChar_x, (gameChar_y - 62), 25);
            fill(255,255,255);
            ellipse((gameChar_x - 5), (gameChar_y - 61), 8, 6);
            fill(0);
            ellipse((gameChar_x - 6), (gameChar_y - 61), 2, 2);
            arc((gameChar_x), (gameChar_y - 66), 25, 18, PI, TWO_PI);
            fill(0,191,255);
            rect((gameChar_x - 4), (gameChar_y - 65), 7, 30, 20);
        }
        else if(isRight && isFalling)
        {
            strokeWeight(1);
            stroke(0);
            strokeWeight(7);
            line((gameChar_x + 22), (gameChar_y - 20), (gameChar_x), (gameChar_y - 17));
            strokeWeight(1);
            fill(0);
            rect((gameChar_x + 17), (gameChar_y - 29), 7, 12, 20);
            fill(0,191,255);
            ellipse(gameChar_x, (gameChar_y - 35), 20, 40);
            fill(255,192,203);
            ellipse(gameChar_x, (gameChar_y - 62), 25);
            fill(255,255,255);
            ellipse((gameChar_x + 5), (gameChar_y - 61), 8, 6);
            fill(0);
            ellipse((gameChar_x + 6), (gameChar_y - 61), 2, 2);
            arc((gameChar_x), (gameChar_y - 66), 25, 18, PI, TWO_PI);
            fill(0,191,255);
            rect((gameChar_x - 4), (gameChar_y - 65), 7, 30, 20);
        }
        else if(isLeft)
        {
            strokeWeight(1);
            stroke(0);
            strokeWeight(7);
            line((gameChar_x), (gameChar_y - 2), (gameChar_x), (gameChar_y - 37));
            strokeWeight(1);
            fill(0);
            rect((gameChar_x - 7), (gameChar_y - 2), 10, 5, 20);
            fill(0,191,255);
            ellipse(gameChar_x, (gameChar_y - 35), 20, 40);
            fill(255,192,203);
            ellipse(gameChar_x, (gameChar_y - 62), 25);
            fill(0,191,255);
            rect((gameChar_x - 4), (gameChar_y - 48), 7, 30, 20);
            fill(0);
            fill(255,255,255);
            ellipse((gameChar_x - 5), (gameChar_y - 61), 8, 6);
            fill(0);
            ellipse((gameChar_x - 6), (gameChar_y - 61), 2, 2);
            arc((gameChar_x), (gameChar_y - 66), 25, 18, PI, TWO_PI);
        }
        else if(isRight)
        {
            strokeWeight(1);
            stroke(0);
            strokeWeight(7);
            line((gameChar_x), (gameChar_y - 2), (gameChar_x), (gameChar_y - 37));
            strokeWeight(1);
            fill(0);
            rect((gameChar_x - 3), (gameChar_y - 2), 10, 5, 20);
            fill(0,191,255);
            ellipse(gameChar_x, (gameChar_y - 35), 20, 40);
            fill(255,192,203);
            ellipse(gameChar_x, (gameChar_y - 62), 25);
            fill(0,191,255);
            rect((gameChar_x - 4), (gameChar_y - 48), 7, 30, 20);
            fill(255,255,255);
            ellipse((gameChar_x + 5), (gameChar_y - 61), 8, 6);
            fill(0);
            ellipse((gameChar_x + 6), (gameChar_y - 61), 2, 2);
            arc((gameChar_x), (gameChar_y - 66), 25, 18, PI, TWO_PI);
        }
        else if(isFalling || isPlumeting)
        {
            strokeWeight(1);
            stroke(0);
            strokeWeight(7);
            line((gameChar_x - 18), (gameChar_y - 8), (gameChar_x + 15), (gameChar_y - 37));
            line((gameChar_x + 18), (gameChar_y - 8), (gameChar_x - 15), (gameChar_y - 45));
            strokeWeight(1);
            fill(0);
            rect((gameChar_x + 15), (gameChar_y - 10), 10, 5, 20);
            rect((gameChar_x - 25), (gameChar_y - 10), 10, 5, 20);
            fill(0,191,255);
            ellipse(gameChar_x, (gameChar_y - 35), 30, 40);
            fill(255,192,203);
            ellipse(gameChar_x, (gameChar_y - 62), 25);
            fill(0,191,255);
            rect((gameChar_x + 12), (gameChar_y - 65), 7, 30, 20);
            rect((gameChar_x - 20), (gameChar_y - 65), 7, 30, 20);
            fill(0);
            fill(255,255,255);
            ellipse((gameChar_x + 5), (gameChar_y - 61), 8, 6);
            ellipse((gameChar_x - 5), (gameChar_y - 61), 8, 6);
            fill(0);
            ellipse((gameChar_x - 5), (gameChar_y - 61), 2, 2);
            ellipse((gameChar_x + 5), (gameChar_y - 61), 2, 2);
            arc((gameChar_x), (gameChar_y - 66), 25, 18, PI, TWO_PI);
            fill(255,0,0);
            arc((gameChar_x), (gameChar_y - 57), 10, 10, TWO_PI, PI);
        }
        else
        {
            strokeWeight(1);
            stroke(0);
            strokeWeight(7);
            line((gameChar_x - 10), (gameChar_y), gameChar_x - 5, gameChar_y - 30);
            line((gameChar_x + 10), (gameChar_y), gameChar_x + 5, gameChar_y - 30);
            strokeWeight(1);
            fill(0);
            rect((gameChar_x + 7), (gameChar_y - 2), 10, 5, 20);
            rect((gameChar_x - 18), (gameChar_y - 2), 10, 5, 20);
            fill(0,191,255);
            ellipse(gameChar_x, (gameChar_y - 35), 30, 40);
            fill(255,192,203);
            ellipse(gameChar_x, (gameChar_y - 62), 25);
            fill(0,191,255);
            rect((gameChar_x + 12), (gameChar_y - 48), 7, 30, 20);
            rect((gameChar_x - 20), (gameChar_y - 48), 7, 30, 20);
            fill(0);
            fill(255,255,255);
            ellipse((gameChar_x + 5), (gameChar_y - 61), 8, 6);
            ellipse((gameChar_x - 5), (gameChar_y - 61), 8, 6);
            fill(0);
            ellipse((gameChar_x - 5), (gameChar_y - 61), 2, 2);
            ellipse((gameChar_x + 5), (gameChar_y - 61), 2, 2);
            arc((gameChar_x), (gameChar_y - 66), 25, 18, PI, TWO_PI);
        }
}

function drawClouds()
{
    for(var f = 0; f < clouds.length; f++)
    {
            noStroke();
            fill(179, 179, 179);
            ellipse(clouds[f].xpos + 150 ,clouds[f].size, clouds[f].ypos, clouds[f].size - 25, PI, TWO_PI);
            ellipse(clouds[f].xpos + 157, clouds[f].size, clouds[f].ypos - 70, clouds[f].size + 10, PI, TWO_PI);
            ellipse(clouds[f].xpos + 98, clouds[f].size, clouds[f].ypos, clouds[f].size - 25, PI, TWO_PI);
            ellipse(clouds[f].xpos + 98, clouds[f].size, clouds[f].ypos - 70, clouds[f].size + 10, PI, TWO_PI);
    } 
}

function drawMountains()
{
    for(var m = 0; m < mountains.length; m++)
    {
            stroke(51);
            strokeWeight(3);
            fill(99, 99, 99);
            triangle(mountains[m].xpos + 380, mountains[m].ypos - 250, mountains[m].xpos + 200, mountains[m].ypos, mountains[m].xpos + 580, mountains[m].ypos);
            fill(89, 89, 89);
            triangle(mountains[m].xpos + 200, mountains[m].ypos - 250, mountains[m].xpos + 50, mountains[m].ypos, mountains[m].xpos + 401, mountains[m].ypos);
            noStroke();
            fill(207, 33, 33);
            noStroke();
            fill(150, 150, 150);
            ellipse(mountains[m].xpos + 206, mountains[m].ypos - 245, 125, 157, PI, TWO_PI);
            stroke(51);
            fill(255,0,0);
            ellipse(mountains[m].xpos + 206, mountains[m].ypos - 183, 95, 30, PI, TWO_PI);
    }
}

function drawTrees()
{
    for(var i = 0; i < trees.length; i++)
    {
            stroke(51);
            fill(125, 59, 9);
            rect(trees[i].xpos + 350 , floorPos_y - 93, 14, 94);
            noStroke();
            fill(10, 181, 4);
            ellipse(trees[i].xpos + 356, floorPos_y - 150, 105, 127, PI, TWO_PI);
    }
}

function drawCanyon(t_canyon)
{
    noStroke();
    fill(38, 38, 38);
    rect(t_canyon.xpos, t_canyon.ypos, t_canyon.width, t_canyon.ypos);
}

function checkCanyon(t_canyon)
{
    if((gameChar_world_x >= t_canyon.xpos && gameChar_world_x <= t_canyon.xpos + t_canyon.width) && gameChar_y >= t_canyon.ypos)
        {
            t_canyon.isPlumeting = true;
        }
    
    if(t_canyon.isPlumeting == true)
        {
            gameChar_y += 6;
        }
}

function renderFlagpole()
{
    push();
    stroke(150);
    strokeWeight(5);
    line(flagpole.xpos, floorPos_y, flagpole.xpos, floorPos_y - 200);
    
    if(flagpole.isReached)
        {
            noStroke();
            fill(255,0,0);
            rect(flagpole.xpos, floorPos_y - 200, 50, 50);
        } else {
            noStroke();
            fill(255,0,0);
            rect(flagpole.xpos, floorPos_y - 50, 50, 50);
        }
    pop();
}


function checkFlagpole()
{
    console.log("check flagpole")
    
    var d = abs(gameChar_world_x - flagpole.xpos);
    
    if(d < 50)
        {
            flagpole.isReached = true;
            victorySound.play();
        }
    
    if(flagpole.isReached != true && lives < 1)
        {
            loserSound.play();
        }
}

function drawCollectable(t_collectable)
{
    if(t_collectable.isFound == false)
    {
        stroke(51);
        strokeWeight(2);
        fill(255, 255, 0);
        ellipse(t_collectable.xpos, t_collectable.ypos, t_collectable.size + 10);
    }  
}

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.xpos, t_collectable.ypos);
    
    if(d < 15){
        t_collectable.isFound = true;
        coinSound.play();
        game_score += 1;
    }
}