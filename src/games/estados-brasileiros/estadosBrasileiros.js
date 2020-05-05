const ludum = require('../../lib/ludum_pro_bono')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()

// Varaiveis de Display e Imagem
var largura = window.innerWidth;
var altura = window.innerHeight;
var escala = 1;
var imgLargura = 960;
var imgAltura = 981;
var imgL = imgLargura * escala / 2;
var imgA = imgAltura * escala / 2;
var l = largura * escala;
var a = altura * escala;

// Variaveis de Aparencia de Texto
var tamanhoTextoPequeno = 25;
var tamTxtP = tamanhoTextoPequeno * escala;
var tamanhoTextoGrande = 50;
var tamTxtG = tamanhoTextoGrande * escala;
var corTexto = 'white';

// Variaveis de Respostas
var resposta;
var respPos;
var printOps = ['A', 'B', 'C', 'D'];
var ops = [-1, -1, -1, -1];
var opsPosDisp = [1, 3, 5, 7];
// Tipo de key
// 0=Numericas; 1=Açoes
var tipoKey = -1;
// Valores das teclas 1,2,3,4
var keysOpsNumb = [49, 50, 51, 52];
// Valores das teclas de ação do arcade
var keyOpsAct = [keys.action1, keys.action2, keys.action3, keys.action4];

var teclasResp = [49, 50, 51, 52, keys.action1, keys.action2, keys.action3, keys.action4];

// Varaiveis de Pontuação
var pontos = 0;
var pontosMax = 0;
var vez = 1;

// Variaveis de Tempo
var velocidade = 30;
var tempo = 0;
var tempoDelay = 0;
var tMaximo = 5;
var tempoMaximo = tMaximo * velocidade;

// Variaveis de situação
// 0=Start; 1=Jogo; 2=Acerto; 3=Erro
var sit = 0;

var estado = new Array();

// Variavel com Nome dos Estados Em Ordem Alfabética
var estadoNome = [
	"Acre",
	"Alagoas",
	"Amapá",
	"Amazonas",
	"Bahia",
	"Ceará",
	"Espírito Santo",
	"Goiás",
	"Maranhão",
	"Mato Grosso",
	"Mato Grosso do Sul",
	"Minas Gerais",
	"Pará",
	"Paraíba",
	"Paraná",
	"Pernambuco",
	"Piauí",
	"Rio de Janeiro",
	"Rio Grande do Norte",
	"Rio Grande do Sul",
	"Rondônia",
	"Roraima",
	"Santa Catarina",
	"São Paulo",
	"Sergipe",
	"Tocantins"
];

// Variavel com Sigla dos Estados
var estadosSigla = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PA",
	"PB",
	"PR",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SP",
	"SE",
	"TO"
];

function preload() {
	// Carregar na Memória Musica
	// musica = loadSound('audios/brasileirinho8bit.mp3');
	// Carregar na Memória audio de Erro
	// erro = loadSound('audios/erro.mp3');
	// Carregar na Memória audio de Acerto
	// acerto = loadSound('audios/acerto.mp3');
	// Carregar imagens dos estados
	for (var i = 0; i < 26; i++) {
		estado[i] = loadImage("imagens/" + estadosSigla[i] + ".png");
	}
}

function setup() {
	// Configurações de Exibiçao
	createCanvas(l, a);
	frameRate(velocidade);
	// Configurações de Imagens
	imageMode(CENTER);
	// Configurações de Foramas
	rectMode(CENTER);
	noStroke();
	// Configuralções de Audio
	/* musica.setVolume(0.1);
	musica.setLoop(true);
	musica.play();
	erro.setVolume(0.25);
	erro.setLoop(false);
	acerto.setVolume(0.25);
	acerto.setLoop(false); */
	// Primeira Execução de Mapa

	background(75);
	fill(corTexto);
	textSize(tamTxtP * 3);
	textAlign(CENTER);
	text('Aperte OK\nPara Começar', l / 2, a / 2);
	textAlign(LEFT);
}

function draw() {
	// Jogo
	if (sit == 1) {
		fill(255, 0, 0);
		rect(l / 64 * 30, a / 2, l / 48, a / tempoMaximo * tempo);
		tempo++;
	}
	// Acerto de Resposta
	else if (sit == 2) {
		background(75);
		fill(0, 255, 0);
		textSize(tamTxtP * 3);
		textAlign(CENTER);
		text('ACERTO', l / 2, a / 2);
		textAlign(LEFT);
		if (tempoDelay > velocidade * 1) {
			novoMapa();
			sit = 1;
		} else {
			tempoDelay++;
			tempoMaximo -= 0.1
		}

	}
	// Erro de Respsota
	else if (sit == 3) {
		background(75);
		fill(255, 0, 0);
		textSize(tamTxtP * 3);
		text('GAME OVER', l / 2, a / 2);
		fill(255);
		textAlign(CENTER);
		text('Pontuação Máxima = ' + parseInt(pontos) + '\nAperte OK para jogar novamente', l / 2, a * 3 / 4);
		textAlign(LEFT);
		sit = 0;
	}
}

function keyPressed() {
	// Situação de Start
	if (sit == 0) {
		if (keyCode == keys.start) {
			tempoMaximo = tMaximo * velocidade;
			pontos = 0;
			vez = 1;
			novoMapa();
			sit = 1;
		}
	}
	// Situação de Jogo
	if (sit == 1) {
		// Verificar se a tecla apertada é Numerica ou de Açao
		tipoKey = -1;
		for (var i = 0; i < 4; i++) {
			if (keyCode == keysOpsNumb[i]) {
				tipoKey = 0;
			} else if (keyCode == keyOpsAct[i]) {
				tipoKey = 1;
			}
		}
		if (tipoKey == 0 || tipoKey == 1) {
			// Verificar se a resposta foi digitada a tempo
			// Verificar se musica.play();a respsota foi correta
			if (tempo < tempoMaximo && keyCode == teclasResp[respPos + (4 * tipoKey)]) {
				pontos += (tempoMaximo - tempo) * vez;
				// Mudando para situação de acerto
				sit = 2;
				tempoDelay = 0;
				vez++;
				// acerto.play();
			}
			else {
				// Verificar se a pontuação atual foi maior que a maior pontuação
				if (pontos > pontosMax) {
					pontosMax = pontos;
				}
				// Mudando para situação de erro
				sit = 3;
				// erro.play();
			}
		}
	}
}

function novoMapa() {
	// "Limpar a Tela"
	background(75);
	tempo = 0;

	// Desenhar Placar
	fill(corTexto);
	textSize(tamTxtP);
	text('Pontos: ' + parseInt(pontos), l / 12, a / 12);
	text('Máximo de Pontos: ' + parseInt(pontosMax), l / 12, a / 12 * 11);

	// Resetando e Configurando Opçoes
	resposta = floor(random(0, 26));
	ops = [-1, -1, -1, -1];
	respPos = floor(random(0, 4));
	ops[respPos] = resposta;
	// Configurar as outras alternativas
	for (var i = 0; i < 4; i++) {
		if (ops[i] == -1) {
			var opsAtual = floor(random(0, 26));
			while (opsAtual == ops[0] || opsAtual == ops[1] || opsAtual == ops[2] || opsAtual == ops[3]) {
				opsAtual = floor(random(0, 26));
			}
			ops[i] = opsAtual;
		}
	}

	// Desenhar Mapa
	for (var i = 0; i < 26; i++) {
		if (i == resposta) {
			tint(250, 0, 0);
			image(estado[i], l / 4, a / 2, imgL, imgA);
		}
		else {
			noTint();
			image(estado[i], l / 4, a / 2, imgL, imgA);
		}

	}

	// Desenhar Opçoes
	fill(corTexto);
	textSize(tamTxtG);
	for (var i = 0; i < 4; i++) {
		text(printOps[i] + ' - ' + estadoNome[ops[i]], l / 2, a / 8 * opsPosDisp[i]);
	}
}