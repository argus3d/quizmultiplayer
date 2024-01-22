var AppCorrida = function (canvasID, _itens, tamanhoBt, margemBt, margemPergunta, espacamento, ativaTempo, _tempoPergunta, tamanhoTextoBotao, pontosNecessarios, mostraTutorial, _naoembaralhar) {
	var caminho = "resources/image/",
		canvas,
		stage,
		fundo,
		content,
		telaEscolha,
		perguntas,
		dif,
		cont_carro = [],
		pistas = ['pista_inicio.png', 'pista_meio.png', 'pista_meio.png', 'pista_fim.png'],
		fumaca = [],
		positivo,
		tente,
		inicio1 = false,
		btinicia,
		count = 0,
		i_erros = 0,
		i_acertos = 0,
		edgeOffset = 80,
		i_jogador,
		score = 0,
		carros = [],
		carrosBt = [],
		sinal = [],
		frase,
		hit,
		help,
		escolha = 1,
		acerto = false,
		chegada,
		tutorial,
		n_resp = 6,
		jogoGanho=false,
		tempoPergunta = 5000,
		tempoPista = 3000,
		tempoDelay = 3000,
		distancia = 20,
		pistaWidth = 1280,
		sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
	var playerName = document.getElementById("playerName").value;



	function iniciaCorrida() {
		telaEscolha.removeAllChildren();
		count = 0;
		for (var i = 0; i < 3; i++) {
			sinal[i] = new createjs.Bitmap(caminho + "sinal" + i + ".png");
			sinal[i].image.onload = function () { };
			stage.addChild(sinal[i]);
			sinal[i].x = 1000;
			sinal[i].y = 350;
			sinal[i].regX = 153;
			sinal[i].regY = 275;
			sinal[i].scaleX = sinal[i].scaleY = 0;
			createjs.Tween.get(sinal[i]).wait(i * 1000).to({ scaleX: 1, scaleY: 1 }, 250, createjs.Ease.backOut).wait(800).to({ alpha: 0.1 }, 250).call(apaga);

		}
		fundo.x = 0;
		createjs.Tween.get(fundo).wait(3000).call(largada);
		inicio1 = true;
	}
	function animaPistaInicio() {
		createjs.Tween.get(pistas[0]).to({ x: -1280 }, tempoPista, createjs.Ease.linear);
		createjs.Tween.get(pistas[1]).to({ x: 0 }, tempoPista, createjs.Ease.linear).call(animaPistaLooping);
	}
	function animaPistaLooping() {
		createjs.Tween.get(pistas[1], { loop: true }).to({ x: -1280 }, tempoPista, createjs.Ease.linear);
		createjs.Tween.get(pistas[2], { loop: true }).to({ x: 0 }, tempoPista, createjs.Ease.linear);
	}
	function animaPistaFim() {


		if (pistas[2].x > pistas[1].x) {
			pistas[3].x = pistas[2].x + 1280;
		} else {
			pistas[3].x = pistas[1].x + 1280;
		}
		createjs.Tween.get(pistas[1], { override: true }).to({ x: -1280 }, tempoPista, createjs.Ease.linear);
		createjs.Tween.get(pistas[2], { override: true }).to({ x: -1280 }, tempoPista, createjs.Ease.linear);
		createjs.Tween.get(pistas[3], { override: true }).to({ x: 0 }, tempoPista, createjs.Ease.linear);
	}
	function largada(evt) {
		animaPistaInicio();
		for (var i = 0; i < 3; i++) {
			createjs.Tween.get(carros[i], { loop: true }).to({ x: 50 }, randomiza(), createjs.Ease.quadInOut).to({ x: 0 }, randomiza(), createjs.Ease.quadInOut);
			createjs.Tween.get(cont_carro[i]).to({ x: 50 }, 2000, createjs.Ease.quadOut);
			fumaca[i].visible = true;
		}
		montaFase();
	}
	function randomiza() {
		var n = Math.floor(Math.random() * 500) + 500;
		return n;
	}
	function montaFase() {
		inicia = true;

		var frase = new createjs.Container();
		var extensao = _itens[count].pergunta.split('.').pop();
		if (extensao == 'jpg' || extensao == 'png') {
			img = new createjs.Bitmap(caminho + _itens[count].pergunta);
			img.image.onload = function () { };
			frase.addChild(img);

		} else {
			var txt = new createjs.Text(_itens[count].pergunta, "42px Arial Black", "#ffffff");
			txt.lineWidth = 1000;
			txt.textAlign = "center";

			var contorno = new createjs.Text(_itens[count].pergunta, "42px Arial Black", "#000000");
			contorno.lineWidth = 1000;
			contorno.textAlign = "center";
			contorno.outline = 8;

			contorno.x = 640;
			txt.x = 640;
			frase.addChild(contorno);
			frase.addChild(txt);
		}
		perguntas.addChild(frase);
		frase.x = -1280;
		frase.y = margemPergunta[1];

		createjs.Tween.get(frase).wait(tempoDelay).to({ x: 0 }, 250, createjs.Ease.backOut);
		if (ativaTempo) {
			createjs.Tween.get(content).wait(tempoPergunta + tempoDelay).call(limpaSegue);
		}
		if (_naoembaralhar) {

		} else {
			shuffle(_itens[count].opcoes);
		}


		for (var i = 0; i < _itens[count].opcoes.length; i++) {

			var extensao = _itens[count].opcoes[i].split('.').pop();
			var bt;
			bt = caixaTexto(_itens[count].opcoes[i]);
			bt.tipo = "texto";


			perguntas.addChild(bt);
			bt.x = -640;

			bt.alpha = 1;
			if (espacamento == 'vertical') {
				bt.px = margemBt[0];
				bt.y = margemBt[1] + (tamanhoBt[1] + 5) * i;
			} else {
				if (_itens[count].posicoes) {
					bt.px = _itens[count].posicoes[i][0];
					bt.y = _itens[count].posicoes[i][1];
				} else {
					bt.px = i * (tamanhoBt[0] + espacamento) + margemBt[0];
					bt.y = margemBt[1];

				}

			}

			bt.py = margemBt[1];
			bt.name = _itens[count].opcoes[i];
			bt.certa = _itens[count].certa;
			bt.regX = tamanhoBt[0] / 2;
			bt.regY = tamanhoBt[1] / 2;
			createjs.Tween.get(bt).wait(tempoDelay).to({ x: bt.px }, 250, createjs.Ease.backOut);
			bt.on("mousedown", function (evt) {
				if (inicia) {
					inicia = false;
					if (this.name == this.certa) {
						acerto = true;
						volta = false;
						sons[0].play();
						i_acertos++;
						animaIco("certo", this.px, this.py);
					} else {
						sons[1].play();
						i_erros++;
						this.alpha = 0.25;
						acerto = false;
						animaIco("errado", this.px, this.py);
					}
					createjs.Tween.get(content).wait(tempoDelay).call(limpaSegue);
				}
			});

		}

	}
	function animaIco(qual, b, c) {
		var ico;
		ico = new createjs.Bitmap(caminho + qual + ".png");
		perguntas.addChild(ico);
		ico.x = b - 30;
		ico.y = c - 150;
		ico.regX = 98;
		ico.regY = 98;
		ico.scaleX = ico.scaleY = 0.1;
		createjs.Tween.get(ico).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut);
	}
	function limpaSegue() {

		const message = JSON.stringify({ type: 'answer', correct: acerto, playerName, playerId:i_jogador });
		socket.send(message);
		acerto = false;

		perguntas.removeAllChildren();
		if (count < _itens.length - 1) {
			count++;
			montaFase();
		} else {
			Fim();
			inicio1 = false;
			if (i_acertos >= pontosNecessarios) {
				jogoGanho=true;
				const message = JSON.stringify({ type: 'answer', correct: "fim", playerName, playerId:i_jogador });
				socket.send(message);
			}


		}

	}
	function Fim() {
		animaPistaFim();

		chegada.visible = true;
		createjs.Tween.get(chegada, { loop: true }).to({ rotation: 30 }, 1000, createjs.Ease.quadInOut).to({ rotation: -30 }, 1000, createjs.Ease.quadInOut);

		var i;
		for (i = 0; i < cont_carro.length; i++) {
			createjs.Tween.get(cont_carro[i], { override: true }).to({ x: cont_carro[i].x + 1380 }, 4000, createjs.Ease.quadIn);
		}
		if (i_acertos >= pontosNecessarios) {
			positivo.visible = true;
			positivo.y = 720;
			createjs.Tween.get(positivo).wait(4000).to({ y: 150 }, 750, createjs.Ease.quadOut);
		} else {
			tente.visible = true;
			tente.y = 720;
			createjs.Tween.get(tente).wait(4000).to({ y: 150 }, 750, createjs.Ease.quadOut);
		}

	}
	function shuffle(a) {
		var j, x, i;
		for (i = a.length; i; i -= 1) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
	}

	function ticker(event) {
		stage.update();
	}
	function apaga() {
		stage.removeChild(this);

	}
	function caixaTexto(texto) {

		var txt = new createjs.Text(texto, tamanhoTextoBotao + "px Arial", "#000000");
		txt.textAlign = "center";
		txt.lineWidth = tamanhoBt[0];

		var tamX = txt.getBounds().width + 80;
		var tamY = txt.getBounds().height + 50;
		txt.regY = tamY / 2 - 35;

		var button = new createjs.Shape();
		button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
		button.graphics.drawRoundRect(0, 0, tamanhoBt[0], tamanhoBt[1], 20);
		button.graphics.endFill();
		button.regX = tamanhoBt[0] / 2;
		button.regY = tamanhoBt[1] / 2 - 10;

		var t = new createjs.Container();
		t.addChild(button);
		t.addChild(txt);

		return t;

	}

	function reseta() {
		location.reload()
	}

	var index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}
	if (_naoembaralhar) {

	} else {
		//shuffle(_itens);

	}
	canvas = document.getElementById(canvasID);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	fundo = new createjs.Container();
	content = new createjs.Container();
	telaEscolha = new createjs.Container();

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	perguntas = new createjs.Container();
	for (var i = 0; i < pistas.length; i++) {
		var t = caminho + pistas[i];
		pistas[i] = new createjs.Bitmap(t);
		pistas[i].image.onload = function () { };
		stage.addChild(pistas[i]);
	}
	pistas[0].x = 0;
	pistas[1].x = 1280;
	pistas[2].x = 1280;
	pistas[3].x = 1280;

	stage.addChild(content);
	stage.addChild(perguntas);
	stage.addChild(telaEscolha);

	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho + "rastro.png"],
		"frames": { "regX": 0, "height": 113, "count": 6, "regY": 0, "width": 180 },
		"animations": {
			"idle": 0,
			"fumaca1": [0, 5, "fumaca1", 0.5]
		}
	});

	for (var i = 0; i < 3; i++) {
		cont_carro[i] = new createjs.Container();
		carros[i] = new createjs.Bitmap(caminho + "carro" + i + ".png");
		carros[i].image.onload = function () { };

		cont_carro[i].addChild(carros[i]);
		content.addChild(cont_carro[i]);
		cont_carro[i].x = 150 + i * 50;
		cont_carro[i].y = 70 + i * 180;

		fumaca[i] = new createjs.Sprite(spriteSheet, "idle");
		cont_carro[i].addChild(fumaca[i]);
		fumaca[i].gotoAndPlay("fumaca1");
		fumaca[i].x = -80;
		fumaca[i].y = 190;
		fumaca[i].visible = false;

		var txt = new createjs.Text("...", "22px Arial Black", "#ffffff");
		txt.textAlign = "center";
		txt.x = -10;
		txt.y = 160;
		txt.lineWidth = 100;
		txt.name = "apelido";
		cont_carro[i].addChild(txt);


	}
	var fundo_esc = new createjs.Bitmap(caminho + "escolha.png");
	fundo_esc.image.onload = function () { };
	//telaEscolha.addChild(fundo_esc);

	tutorial = new createjs.Bitmap(caminho + "tutorial.png");
	tutorial.image.onload = function () { };
	stage.addChild(tutorial);
	tutorial.on("click", function () {
		tutorial.visible = false;

	});
	if (!mostraTutorial) {
		tutorial.visible = false;
	}

	btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
	btinicia.image.onload = function () { };
	stage.addChild(btinicia);
	btinicia.on("click", function () {


	});
	positivo = new createjs.Bitmap(caminho + "positivo.png");
	positivo.image.onload = function () { };
	stage.addChild(positivo);
	positivo.x = 460;
	positivo.y = 150;
	positivo.visible = false;
	positivo.on("click", function () {
		//reseta();

	});

	tente = new createjs.Bitmap(caminho + "tentenovamente.png");
	tente.image.onload = function () { };
	stage.addChild(tente);
	tente.x = 470;
	tente.y = 150;
	tente.visible = false;
	tente.on("click", function () {
		//reseta();

	});

	chegada = new createjs.Bitmap(caminho + "chegada.png");
	chegada.image.onload = function () { };
	stage.addChild(chegada);
	chegada.regX = 347;
	chegada.regY = 360;
	chegada.x = 1180;
	chegada.y = 730;
	chegada.rotation = -30;
	chegada.visible = false;

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);



	const socket = new WebSocket('ws://18.230.122.83:80');
	//const socket = new WebSocket('ws://localhost:80');
	setTimeout(function () {
		let message = JSON.stringify({ type: 'answer', correct: "inicio", playerName });
		socket.send(message);
	}, 1000)


	// Handle initial game state
	socket.addEventListener('message', (event) => {
		const data = JSON.parse(event.data);
		var podeiniciar = false;
		if (data.type === 'init') {
			const playerId = data.playerId;
			i_jogador=playerId;
			const carPositions = data.carPositions;
			const playerNames = data.playerNames;
			console.log(`Player ${i_jogador} (You) has position ${carPositions[playerId]}`);
			for (const otherPlayerId in playerNames) {
				console.log(`Player ${otherPlayerId} is in the game: ${playerNames[otherPlayerId]}`);
			}

			escolha = playerId - 1;
			var iconePlayer = new createjs.Bitmap(caminho + "iconeplayer.png");
			iconePlayer.image.onload = function () { };
			iconePlayer.x = 300;
			iconePlayer.alpha = 0.7;
			cont_carro[escolha].addChild(iconePlayer);



			console.log("init", playerId, carPositions);
			// Handle the initial state for the player, including car positions
			if (playerId == 3) {
				podeiniciar = true;
			}
		}
		if (data.type === 'playerJoined') {
			const newPlayerId = data.playerId;
			const newPlayerName = data.playerName;
			console.log(`Player ${newPlayerId} (${newPlayerName}) has joined the game`);

			// Handle the new player joining
			if (newPlayerId == 3) {
				podeiniciar = true;
			}
		}
		if (podeiniciar) {
			btinicia.visible = false;
			carrosBt = [];
			inicio1 = true;
			iniciaCorrida();
		}
		if (data.type === 'playerLeft') {
			const playerId = data.playerId;
			const leftPlayerName = data.playerName;
			console.log(`Player ${playerId} (${leftPlayerName}) has left the game`);

			reseta();
			// Handle the player leaving
		}
		if (data.type === 'updateNames') {
			const carNames = data.nomes;
			let i = 0;
			for (const playerId in carNames) {
				if (carNames.hasOwnProperty(playerId)) {
					const _nome = carNames[playerId];
					console.log(`nome:`, _nome);
					var _txt = cont_carro[i].getChildByName("apelido");
					if (_txt) {
						_txt.text = _nome;
					}
					i++;
				}
			}
		}
		if (data.type === 'updateCarPositions') {
			const carPositions = data.newPos;
			console.log(carPositions)
			//const updatedPlayerName = data.playerName;

			// Modify this line
			// Update the positions of the cars based on the received data
			//console.log(`Player ${updatedPlayerName} has a new position`);
			let i = 0;
			if (inicio1) {
				for (const playerId in carPositions) {
					if (carPositions.hasOwnProperty(playerId)) {
						let position = carPositions[playerId];
						console.log(`Player ${playerId} has position ${position}`);
						createjs.Tween.get(cont_carro[i]).to({ x: cont_carro[i].x+position }, 500, createjs.Ease.quadOut);
						i++;
					}
				}
			}

			// Update the positions of the cars based on the received data
		}
		if (data.type === 'updateGameState') {
			const msg = data.msg;
			if (msg == "fim") {
				perguntas.removeAllChildren();
				Fim();
			}
			console.log("updateGameState", msg);
			// Update the game state based on data received from the server
		}
	});

}