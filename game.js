/*
   熊を爆発させるゲーム
   効果音：http://www.yen-soft.com/ssse/
*/

enchant();

window.onload = function() {

	var game = new Game(320, 320);
	game.fps = 30;
	game.preload([
			'image/bg.png',
			'image/player.gif',
			'image/chara.gif',
			'image/effect.gif',
			'se.mp3',
			'bgm.mp3'
			]);
	game.count = 0;

	game.onload = function() {
		

		game.rootScene.addEventListener('enterframe', function() {

			if (game.count % 20 == 0) {
				var type = isType(game.count);
				var enemy = createEnemy(game, type);
				game.rootScene.addChild(enemy);
			}

			var time = (game.count / game.fps).toFixed(2);
			timeLabel.text = "TIME: " +time + " s";

			if (game.assets['bgm.mp3'].currentTime >= 39) {
				game.assets['bgm.mp3'].play();
			}

			game.count++;
		});

		// タッチした時移動
		game.rootScene.addEventListener('touchstart', function(e) {
			player.x = e.localX;
			player.y = e.localY;
		});

		player = new Sprite(16, 16);
		player.x = 160;
		player.y = 160;
		player.image = game.assets['image/player.gif'];
		player.frame = 11;

		// 背景
		var background = new Sprite(320, 320);
		background.x = background.y = 0;
		background.image = game.assets['image/bg.png'];

		// スコア
		var timeLabel = new Label();
		timeLabel.x = timeLabel.y = 8;
		timeLabel.font="bold 20px 'ＭＳ ゴシック',monospace";
		timeLabel.text = "TIME";

		// BGMの再生
		game.assets['bgm.mp3'].play();
		

		// 配置
		game.rootScene.addChild(background);
		game.rootScene.addChild(player);
		game.rootScene.addChild(timeLabel);

	}
	game.start();

}


// 熊を作成する関数
function createEnemy(game, type) {

	var enemy = new Sprite(32,32);
	enemy.x = 0;
	enemy.y = rand(240) + 40;

	enemy.image = game.assets['image/chara.gif'];

	// 表示する熊を選択
	var enemy_frame = type * 5;
	enemy.frame = enemy_frame;

	var speed = 1;

	switch (type) {

		case 0:
			// 通常熊
			speed = ( rand(5) + 3 );
			break;
		case 1:
			// 遅い熊
			speed = 1;
			break;

		default:
			break;
	}

	var count = 0;
	enemy.addEventListener('enterframe', function() {
		if(enemy.x > 320) {
			var time = (game.count / game.fps).toFixed(2);
			game.end(time, time + "秒間、熊の魔の手から生き延びました");
		}
		if(enemy.intersect(player)){
			var sound = game.assets['se.mp3'].clone();
			sound.play();
			game.rootScene.addChild(createEffect(game, enemy.x, enemy.y));
			game.rootScene.removeChild(this);
		} else {
			// 可変熊は別で計算
			if (type == 2) {
			enemy.x += isSpeed(count);
			}
			enemy.x += speed;
			enemy.frame = enemy_frame + Math.floor(count / 3) % 3;
			count++;
		}
	});

	return enemy;

}

// エフェクトを発生させる
function createEffect(game, x, y) {
	var effect = new Sprite(16, 16);
	effect.x = x + 8;
	effect.y = y + 8;

	effect.image = game.assets['image/effect.gif'];
	effect.frame = 0;

	var count = 0;
	effect.addEventListener('enterframe', function() {
		effect.frame = count;

		if (count > 3) {
			game.rootScene.removeChild(this);
		}
		count++;
	});

	return effect;
}

// 引数 num を受け取って、0 から (num - 1) までの乱数を返す関数
function rand(num) {
	return Math.floor(Math.random() * num);
}

function isSpeed(count) {

	var speed = Math.floor((count / 8) + 1);
	return speed;

}

function isType(count) {
	var type = 0;

	if (count > 900 ) {
		type = rand(3);
	} else if(count > 450 ) {
		type = rand(2);
	} else {
		type = 0;
	}

	return type;
}
