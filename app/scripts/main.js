'use strict';

var bolinha = { 
    seletor: '#bolinha',
    posicao: {
        leftInicial: 30,
        left: 30,
        topInicial: 250,
        top: 250
    }
};

var start = {
    seletor: '#start'
};

var resultado = {
    seletor: '.resultado',
    venceu: {
        texto: 'Aeee... Parabens!',
        cls: 'alert-success'
    },
    perdeu: {
        texto: 'Ooops... Tente novamente!',
        cls: 'alert-danger'
    }
};

var copo = {

    A: { 
        seletor: '#A',
        posicao: {
            leftInicial: 0,
            left: 0
        }
    },

    B: { 
        seletor: '#B',
        posicao: {
            leftInicial: 275,
            left: 275
        }
    },

    C: { 
        seletor: '#C',
        posicao: {
            leftInicial: 545,
            left: 545
        }
    },

    obterCopoAleatorio: function () {
        var numeroDoCopo = Math.round(Math.random() * 2); // random de 0 a 2
        var resultado = {};
        switch (numeroDoCopo) {
            case 0: resultado = copo.A; break;
            case 1: resultado = copo.B; break;
            case 2: resultado = copo.C; break;
        }
        return resultado;
    },

    obterIndice: function (copos, item) {
        for (var i = 0; i < copos.length; i++) {
            if (copos[i].seletor === item.seletor) {
                return i;
            }
        }
        return 0;
    },

    obterLeftDeAcordoCom: function (indice) {
        var $this = this,
            left = 0;

        switch (indice) {
            case 0: left = $this.A.posicao.leftInicial; break;
            case 1: left = $this.B.posicao.leftInicial; break;
            case 2: left = $this.C.posicao.leftInicial; break;
        }
        return left;
    },

    obterCoposQueSeraoMovidos: function () {
        var $this = this,
            primeiroCopo = $this.obterCopoAleatorio(),
            segundoCopo = $this.obterCopoAleatorio();

         while (primeiroCopo.seletor === segundoCopo.seletor) {
            segundoCopo = $this.obterCopoAleatorio();
        }

        return [primeiroCopo, segundoCopo];
    }
};

var jogo = {

    numeroJogadas: 0,
    maximoJogadas: 5,
    vitorias: 0,
    copoSelecionado: {},
    
    copos: [copo.A, copo.B, copo.C],

    desenhar: function () {
        $('#main').append('<div id="A" class="copo"></div><div id="B" class="copo"><div id="bolinha"></div></div><div id="C" class="copo"></div><div class="clear"></div>');
        $('.content').append('<div class="resultado alert"></div><button id="start" class="btn btn-lg btn-primary">Start</button>');
        $(copo.A.seletor).css('left', copo.A.posicao.leftInicial);
        $(copo.B.seletor).css('left', copo.B.posicao.leftInicial);
        $(copo.C.seletor).css('left', copo.C.posicao.leftInicial);

        $('.copo').on('click', function () {
            jogo.copoSelecionado = copo[this.id];
            jogo.confirmarCopoSelecionado();
            jogo.posicionarBolinhaForaDoCopo();
            $(bolinha.seletor).animate({top: bolinha.posicao.top}, {complete: function () {
                jogo.exibirResultado();
                $(start.seletor).removeClass('disabled');
            }});
        });

        $(start.seletor).on('click', jogo.start);
    },

    trocarPosicao: function (primeiroCopo, segundoCopo) {
        var $this = this,
            indicePrimeiroCopo = copo.obterIndice($this.copos, primeiroCopo),
            indiceSegundoCopo = copo.obterIndice($this.copos, segundoCopo);

        primeiroCopo.posicao.left = copo.obterLeftDeAcordoCom(indiceSegundoCopo);
        segundoCopo.posicao.left = copo.obterLeftDeAcordoCom(indicePrimeiroCopo);
        $this.copos[indicePrimeiroCopo] = segundoCopo;
        $this.copos[indiceSegundoCopo] = primeiroCopo;
    },

    play: function () {
        var
            $this = this,
            copos = copo.obterCoposQueSeraoMovidos(),
            primeiroCopo = copos[0],
            segundoCopo = copos[1];

        $this.trocarPosicao(primeiroCopo, segundoCopo);

        $.when(
            $(primeiroCopo.seletor).animate({left: primeiroCopo.posicao.left}).promise(),
            $(segundoCopo.seletor).animate({left: segundoCopo.posicao.left}).promise()
        )
        .done( function () {
            if ($this.numeroJogadas < $this.maximoJogadas) {
                $this.numeroJogadas++;
                $this.play();
            }
        });
    },

    posicionarBolinhaDentroDoCopo: function () {
        bolinha.posicao.top = bolinha.posicao.topInicial - 170;
    },

    posicionarBolinhaForaDoCopo: function () {
        bolinha.posicao.top = bolinha.posicao.topInicial;
    },

    confirmarCopoSelecionado: function () {
        var venceu = (jogo.copoSelecionado === copo.B) ? true : false;
        if (venceu) {
            jogo.vitorias++;
        }
    },

    exibirResultado: function () {
        var div = $(resultado.seletor),
            res = (jogo.vitorias > 0) ? resultado.venceu : resultado.perdeu;

        div.html(res.texto);
        div.removeClass(resultado.venceu.cls);
        div.removeClass(resultado.perdeu.cls);
        div.addClass(res.cls);
        div.show();

    },

    reset: function () {
        var $this = this;
        $this.vitorias = 0;
        $this.numeroJogadas = 0;
        $(resultado.seletor).hide();
    },

    start: function () {
        jogo.reset();
        jogo.posicionarBolinhaDentroDoCopo();
        $(bolinha.seletor).animate({top: bolinha.posicao.top}, {complete: function () {
            jogo.play();
            $(start.seletor).addClass('disabled');
        }});
        
    }
};